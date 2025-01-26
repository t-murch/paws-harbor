import {
  insertPricingSchema,
  InsertServiceSchema,
  NewService,
  Pricing,
  pricingTable,
  SelectServiceSchema,
  Service,
  servicesTable,
} from '@repo/shared/db/schemas/schema';
import {
  NewServicePricingT,
  ServicePricingDetails,
  ServicePricingService,
} from '@repo/shared/types/servicePricing';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import { GeneralError, GeneralResponse } from '..';

type ServicePricingDTO = {
  services: Service;
  service_pricing: Pricing;
};

function reduceToServicePricingDetails(
  acc: Record<string, ServicePricingDetails>,
  val: ServicePricingDTO
) {
  if (acc[val.services.id]) {
    acc[val.services.id].durationOptions.push(val.service_pricing);
  } else {
    acc[val.services.id] = {
      ...val.services,
      durationOptions: [val.service_pricing],
    };
  }
  return acc;
}

function toServicePricingDetails(
  dto: ServicePricingDTO
): ServicePricingDetails {
  return {
    ...dto.services,
    durationOptions: [
      {
        createdAt: dto.service_pricing.createdAt,
        durationUnit: dto.service_pricing.durationUnit,
        durationValue: dto.service_pricing.durationValue,
        id: dto.service_pricing.id,
        serviceId: dto.service_pricing.serviceId,
        tierLevel: dto.service_pricing.tierLevel,
        tieredRate: dto.service_pricing.tieredRate,
      },
    ],
  };
}

export class ServicePricingRepository {
  constructor(private db: PostgresJsDatabase<Record<string, never>>) {
    this.db = db;
  }

  async create(
    sp: NewServicePricingT
  ): Promise<GeneralResponse<ServicePricingDetails['id'], GeneralError>> {
    // Parse out the Service for persistence
    const service: NewService = {
      description: sp.description,
      isTiered: sp.isTiered || false,
      metadata: sp.metadata,
      name: sp.name,
    };
    const {
      data: serviceData,
      error,
      success,
    } = InsertServiceSchema.safeParse(service);
    if (!success) {
      console.error(`Error parsing service: ${error}`);
      return { error: { message: JSON.stringify(error) }, success: false };
    }

    try {
      return await this.db.transaction(async (db) => {
        const [createdService] = await db
          .insert(servicesTable)
          .values(serviceData)
          .returning();

        const pricing = sp.durationOptions.map((val) => ({
          ...val,
          serviceId: createdService.id,
        }));
        const {
          data: pricingData,
          error,
          success,
        } = insertPricingSchema.array().safeParse(pricing);
        if (!success) {
          console.error(`Error parsing pricing: ${error}`);
          return { error: { message: JSON.stringify(error) }, success: false };
        }

        const createdPricing = await db
          .insert(pricingTable)
          // BROKEN DUE TO THE SCHEMA CHANGE MADE EARLIER FOR THE WEB BUILD TO PASS
          // THE SCHEMA SHOULD BE CHANGED BACK FOR THIS LOCATION
          // AND SPLIT OUT THE WEB VERSION TO BE DERIVED FROM THIS
          .values(pricingData)
          .onConflictDoNothing()
          .returning();

        const newData: ServicePricingDetails = {
          ...createdService,
          durationOptions: createdPricing,
        };

        return { data: newData['id'], success: true };
      });
    } catch (error) {
      console.error(`Error creating service pricing: ${error}`);
      return { error: { message: JSON.stringify(error) }, success: false };
    }
  }

  async getAllServices(): Promise<
    GeneralResponse<ServicePricingDetails[], GeneralError>
  > {
    const services: ServicePricingDTO[] = await this.db
      .select()
      .from(servicesTable)
      .innerJoin(pricingTable, eq(servicesTable.id, pricingTable.serviceId));

    console.log(`services=${JSON.stringify(services, null, 2)}`);
    return {
      data: Object.values(
        services.reduce(
          reduceToServicePricingDetails,
          {} as Record<string, ServicePricingDetails>
        )
      ),
      success: true,
    };
  }

  async getServiceById(
    id: string
  ): Promise<GeneralResponse<ServicePricingDetails, GeneralError>> {
    const [service]: ServicePricingDTO[] = await this.db
      .select()
      .from(servicesTable)
      .innerJoin(pricingTable, eq(servicesTable.id, pricingTable.serviceId))
      .where(eq(servicesTable.id, id));

    return service
      ? { data: toServicePricingDetails(service), success: true }
      : {
          error: { message: `Unknown error GET Service by ID.` },
          success: false,
        };
  }

  async updateService(
    id: Service['id'],
    service: Partial<Service>
  ): Promise<GeneralResponse<Service, GeneralError>> {
    const validated = SelectServiceSchema.partial().parse(service);

    const [updated] = await this.db
      .update(servicesTable)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(servicesTable.id, id))
      .returning();

    return { data: updated, success: true };
  }

  async updateServicePricing(
    id: ServicePricingDetails['id'],
    sp: Partial<ServicePricingDetails>
  ): Promise<GeneralResponse<ServicePricingDetails, GeneralError>> {
    const { durationOptions, ...service } = sp;

    const updatedServicePricing = await this.db.transaction(async (tx) => {
      const validated = SelectServiceSchema.partial().parse(service);
      const [updatedService] = await tx
        .update(servicesTable)
        .set({
          ...validated,
          updatedAt: new Date(),
        })
        .where(eq(servicesTable.id, id))
        .returning();

      if (!durationOptions) {
        return null;
      }

      const updatePricingQueries = durationOptions.map(async (val) => {
        const [updatedRow] = await tx
          .update(pricingTable)
          .set(val)
          .where(eq(pricingTable.serviceId, id))
          .returning();
        return updatedRow;
      });

      const updatedPricing = await Promise.all(updatePricingQueries);

      return { ...updatedService, durationOptions: updatedPricing };
    });

    return updatedServicePricing
      ? { data: updatedServicePricing, success: true }
      : {
          error: { message: 'Error updating service pricing' },
          success: false,
        };
  }

  async bulkUpdate(
    services: NewServicePricingT[]
  ): Promise<GeneralResponse<ServicePricingDetails[], GeneralError>> {
    const parseInput = z
      .array(ServicePricingService.NewServicePricingSchema)
      .safeParse(services);

    if (!parseInput.success) {
      return {
        error: {
          details: parseInput.error.errors.map((val) => ({
            field: val.path.join('.'),
            message: val.message,
          })),
          message: 'Validation error.',
        },
        success: false,
      };
    }

    try {
      const results = await this.db.transaction(async (tx) => {
        const updates = services.map(async (item) => {
          const { durationOptions, ...service } = item;
          service.updatedAt = new Date();

          const [updatedService] = await tx
            .insert(servicesTable)
            .values(service)
            .onConflictDoUpdate({
              set: {
                description: service.description,
                isTiered: service.isTiered,
                metadata: service.metadata,
                name: service.name,
                updatedAt: service.updatedAt,
              },
              target: servicesTable.id,
            })
            .returning();

          const updatedPricing = await Promise.all(
            durationOptions.map(async (option) => {
              const [pricing] = await tx
                .insert(pricingTable)
                .values({ ...option, serviceId: updatedService.id })
                .onConflictDoUpdate({
                  set: {
                    durationUnit: option.durationUnit,
                    serviceId: updatedService.id,
                    tierLevel: option.tierLevel,
                    tieredRate: option.tieredRate,
                  },
                  target: pricingTable.serviceId,
                })
                .returning();
              return pricing;
            })
          );

          return {
            ...updatedService,
            durationOptions: updatedPricing,
          };
        });

        return await Promise.all(updates);
      });

      console.log(`results=${JSON.stringify(results, null, 2)}`);

      return {
        data: results,
        success: true,
      };
    } catch (error) {
      return {
        error: { message: JSON.stringify(error) },
        success: false,
      };
    }
  }
  /**
   * This will perform a delete on the service table
   * and cascade delete on the pricing table
   */
  async deleteServicePricing(
    id: ServicePricingDetails['id']
  ): Promise<GeneralResponse<boolean, GeneralError>> {
    return await this.db.transaction(async (tx) => {
      await tx.delete(servicesTable).where(eq(servicesTable.id, id));
      return { data: true, success: true };
    });
  }
}
