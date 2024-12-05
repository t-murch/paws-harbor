import {
  InsertServiceAvailability,
  insertServiceAvailabilitySchema,
  RequestServiceAvailability,
  serviceAvailabilityTable,
} from '@/db/availability';
import { log } from '@repo/logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

//TODO: add to shared repo.
export type GeneralResponse<T, E> =
  | { data: T; success: true }
  | { error: E; success: false };

export class AvailabilityRepository {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createAvailability(
    availability: InsertServiceAvailability | RequestServiceAvailability,
    adminId?: string
  ): Promise<GeneralResponse<{ id: string }, { message: string }>> {
    let data: InsertServiceAvailability;

    console.log(
      `adminId=${adminId}, availability=${JSON.stringify(availability)}`
    );
    if (adminId) {
      data = this.requestTypetoInsertType(adminId, availability);
    } else {
      data = availability as InsertServiceAvailability;
    }

    const validated = insertServiceAvailabilitySchema.safeParse(data);
    if (!validated.success) {
      console.log(`data=${JSON.stringify(data)}`);
      const errorMessage = `Create Availability Validation failed. Errors: ${JSON.stringify({ ...validated.error.issues })}`;
      log(errorMessage);
      return { error: { message: errorMessage }, success: false };
    }

    const [result] = await this.db
      .insert(serviceAvailabilityTable)
      .values(validated.data)
      .returning({ id: serviceAvailabilityTable.id });

    return { data: { id: result.id }, success: true };
  }

  deleteAvailability() {}
  getAvailability() {}
  updateAvailability() {}

  requestTypetoInsertType(
    adminId: string,
    availability: RequestServiceAvailability
  ): InsertServiceAvailability {
    return {
      ...availability,
      adminId,
      date: String(availability.date),
      endTime: String(availability.endTime),
      startTime: String(availability.startTime),
    };
  }

  // InsertServiceAvailability type guard
  isInsertServiceAvailability(
    availability: InsertServiceAvailability | RequestServiceAvailability
  ): availability is InsertServiceAvailability {
    return (
      (availability as InsertServiceAvailability).date !== undefined &&
      typeof (availability as InsertServiceAvailability).date === 'string' &&
      (availability as InsertServiceAvailability).adminId !== undefined
    );
  }
}
