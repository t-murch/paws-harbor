import { eq, inArray, sql } from 'drizzle-orm';

import {
  NewService,
  servicesTable,
  Service,
  InsertServiceSchema,
  AllServices,
} from '../services';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ServicePricing } from '@/types/pricing';
import { log } from '@repo/logger';

// Database operations with type safety
export class ServiceRepository {
  constructor(private db: PostgresJsDatabase<Record<string, never>>) {
    this.db = db;
  }

  async create(service: NewService): Promise<Service> {
    // Validate the service data
    const validated = InsertServiceSchema.parse(service);

    const [created] = await this.db
      .insert(servicesTable)
      .values(validated)
      .returning();

    return created;
  }

  async update(id: string, service: Partial<NewService>): Promise<Service> {
    // Validate the update data
    const validated = InsertServiceSchema.partial().parse(service);

    const [updated] = await this.db
      .update(servicesTable)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(servicesTable.id, id))
      .returning();

    return updated;
  }

  async bulkUpdate(services: AllServices[]): Promise<Service[]> {
    log(`services=${JSON.stringify(services, null, 2)}`);
    const validated = InsertServiceSchema.array().parse(services);
    log(`validated=${JSON.stringify(validated, null, 2)}`);
    const newServices = validated.filter((s) => s.id === undefined);
    const ids = validated.map((s) => s.id).filter((s) => s !== undefined);
    log(`ids=${JSON.stringify(ids, null, 2)}`);

    if (validated.length === 0) {
      return [];
    }

    // need to match existing services by id if input services have the same id
    const existingServices = await this.db
      .select()
      .from(servicesTable)
      .where(inArray(servicesTable.id, ids));

    log(`existingServices=${JSON.stringify(existingServices, null, 2)}`);
    const existingServiceMap = new Map<string, Service>(
      existingServices.map((s) => [s.id, s])
    );
    log(`existingServiceMap=${JSON.stringify(existingServiceMap, null, 2)}`);

    const updatedServices = validated.map((s) => {
      const existingService = existingServiceMap.get(s.id ?? '');
      if (existingService) {
        return {
          ...existingService,
          ...s,
          updatedAt: new Date(),
        };
      }
      return s;
    });

    // updatedServices.push(...newServices);
    // log(`newServices=${JSON.stringify(newServices, null, 2)}`);
    log(`updatedServices=${JSON.stringify(updatedServices, null, 2)}`);

    // upsert
    return await this.db.transaction(async (tx) => {
      await tx.delete(servicesTable);

      return await tx
        .insert(servicesTable)
        .values(updatedServices)
        .onConflictDoUpdate({
          set: {
            // Manually spread known fields to satisfy type checking
            description: sql`excluded.description`,
            metadata: sql`excluded.metadata`,
            name: sql`excluded.name`,
            pricingModel: sql`excluded.pricing_model`,
            // Add any other specific fields from your services table
            updatedAt: new Date(),
          },
          target: servicesTable.id,
        })
        .returning();
    });
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, id))
      .limit(1);

    return service[0] ?? null;
  }

  // Example of type-safe query with pricing model filter
  async findByPricingType(type: ServicePricing['type']): Promise<Service[]> {
    return this.db
      .select()
      .from(servicesTable)
      .where(sql`${servicesTable.pricingModel}->>'type' = ${type}`);
  }

  async getAll(): Promise<Service[]> {
    return await this.db.select().from(servicesTable);
  }

  async deleteOne(id: string) {
    if (!id) return null;
    return await this.db
      .delete(servicesTable)
      .where(eq(servicesTable.id, id))
      .returning({ id: servicesTable.id });
  }
}
