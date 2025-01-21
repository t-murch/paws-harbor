import {
  InsertRecurringAvailability,
  insertRecurringAvailabilitySchema,
  InsertServiceAvailability,
  insertServiceAvailabilitySchema,
  RecurringAvailability,
  recurringAvailabilityTable,
  RequestServiceAvailability,
  SelectRecurringAvailability,
  SelectServiceAvailability,
  ServiceAvailability,
  serviceAvailabilityTable,
  UpdateRecurringAvailability,
  updateRecurringAvailabilitySchema,
  UpdateServiceAvailability,
  updateServiceAvailabilitySchema,
} from '@repo/shared/src/db/schemas/availability';
import { log } from '@repo/logger';
import { daysofWeek } from '@repo/shared/src/server';
import { and, between, eq, gte, isNull, lte, or } from 'drizzle-orm';
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

  // async createAvailability(availability: InsertRecurringAvailability | RequestRecurringServiceAvailability, admin?: string): GeneralResponse<{ id: string }, { message: string }>;
  async createAvailability(
    availability: ServiceAvailability | RecurringAvailability,
    adminId?: string
  ): Promise<GeneralResponse<{ id: string }, { message: string }>> {
    let data: InsertServiceAvailability | InsertRecurringAvailability,
      errorMessage = `Create Availability Validation failed. Errors: `,
      returnValue: GeneralResponse<{ id: string }, { message: string }>;

    if (this.isRecurringServiceAvailability(availability)) {
      data = adminId
        ? ({ ...availability, adminId } as InsertRecurringAvailability)
        : (availability as InsertRecurringAvailability);

      const validated = insertRecurringAvailabilitySchema.safeParse(data);
      if (!validated.success) {
        errorMessage += JSON.stringify({ ...validated.error.issues });
        log(errorMessage);
        return { error: { message: errorMessage }, success: false };
      }

      const [result] = await this.db
        .insert(recurringAvailabilityTable)
        .values(validated.data)
        .returning({ id: recurringAvailabilityTable.id });

      returnValue = {
        data: { id: result.id },
        success: true,
      };
    } else if (this.isNonRecurringServiceAvailability(availability)) {
      data = adminId
        ? ({ ...availability, adminId } as InsertServiceAvailability)
        : (availability as InsertServiceAvailability);

      const validated = insertServiceAvailabilitySchema.safeParse(data);
      if (!validated.success) {
        errorMessage += JSON.stringify({ ...validated.error.issues });
        log(errorMessage);
        return { error: { message: errorMessage }, success: false };
      }

      const [result] = await this.db
        .insert(serviceAvailabilityTable)
        .values(validated.data)
        .returning({ id: serviceAvailabilityTable.id });

      returnValue = {
        data: { id: result.id },
        success: true,
      };
    } else {
      return {
        error: { message: 'Invalid availability type' },
        success: false,
      };
    }
    console.log(
      `adminId=${adminId}, availability=${JSON.stringify(availability)}`
    );

    return returnValue;
  }

  async deleteAvailability(
    availabilityId: string,
    recurring?: boolean
  ): Promise<GeneralResponse<{ id: string }, { message: string }>> {
    const table = recurring
      ? recurringAvailabilityTable
      : serviceAvailabilityTable;

    const [result] = await this.db
      .delete(table)
      .where(eq(table.id, availabilityId))
      .returning({ id: table.id });

    if (!result) {
      return {
        error: { message: 'Availability not found' },
        success: false,
      };
    }
    return {
      data: { id: result.id },
      success: true,
    };
  }

  /**
   * Get *all* availability for optional
   * DaysFromToday Param. Default is 30 days.
   * query both recurring and non-recurring availabilities
   * @param date
   * @returns
   */
  async getAllAvailability(
    DaysFromToday: number = 30
  ): Promise<
    GeneralResponse<
      (SelectServiceAvailability | SelectRecurringAvailability)[],
      { message: string }
    >
  > {
    const daysFromTodayDate = new Date(
      new Date().setDate(new Date().getDate() + DaysFromToday)
    );
    const [serviceAvailabilities, recurringAvailabilities] = await Promise.all([
      this.db
        .select()
        .from(serviceAvailabilityTable)
        .where(
          between(
            serviceAvailabilityTable.date,
            new Date().toISOString(),
            daysFromTodayDate.toISOString()
          )
        ),
      this.db
        .select()
        .from(recurringAvailabilityTable)
        .where(
          and(
            lte(recurringAvailabilityTable.startDate, new Date().toISOString()),
            or(
              gte(
                recurringAvailabilityTable.endDate,
                daysFromTodayDate.toISOString()
              ),
              isNull(recurringAvailabilityTable.endDate)
            )
          )
        ),
    ]);

    return {
      data: [...serviceAvailabilities, ...recurringAvailabilities],
      success: true,
    };
  }

  async getAvailability(
    availabilityId: string,
    recurring?: boolean
  ): Promise<
    GeneralResponse<
      SelectServiceAvailability | SelectRecurringAvailability,
      { message: string }
    >
  > {
    const table = recurring
      ? recurringAvailabilityTable
      : serviceAvailabilityTable;
    const [result] = await this.db
      .select()
      .from(table)
      .where(eq(table.id, availabilityId));

    if (!result) {
      return {
        error: { message: 'Availability not found' },
        success: false,
      };
    }

    return {
      data: result as SelectServiceAvailability | SelectRecurringAvailability,
      success: true,
    };
  }

  async updateAvailability(
    availability: UpdateServiceAvailability | UpdateRecurringAvailability,
    adminId?: string
  ): Promise<GeneralResponse<{ id: string }, { message: string }>> {
    let data: UpdateServiceAvailability | UpdateRecurringAvailability,
      errorMessage = `Update Availability Validation failed. Errors: `,
      returnValue: GeneralResponse<{ id: string }, { message: string }>;

    if (this.isRecurringServiceAvailability(availability)) {
      data = adminId
        ? { ...availability, adminId }
        : (availability as UpdateRecurringAvailability);

      log(`data.recurring.avilability=${JSON.stringify(data)}`);
      const validated = updateRecurringAvailabilitySchema.safeParse(data);
      if (!validated.success) {
        errorMessage += JSON.stringify({ ...validated.error.issues });
        log(errorMessage);
        return { error: { message: errorMessage }, success: false };
      }

      const [result] = await this.db
        .update(recurringAvailabilityTable)
        .set(validated.data)
        .where(eq(recurringAvailabilityTable.id, validated.data.id))
        .returning({ id: recurringAvailabilityTable.id });

      log(`recurring.update.result=${JSON.stringify(result)}`);

      returnValue = {
        data: { id: result.id },
        success: true,
      };
    } else if (this.isNonRecurringServiceAvailability(availability)) {
      data = adminId
        ? { ...availability, adminId }
        : (availability as UpdateServiceAvailability);

      log(`data.nonRecurring.avilability=${JSON.stringify(data)}`);
      const validated = updateServiceAvailabilitySchema.safeParse(data);
      if (!validated.success) {
        errorMessage += JSON.stringify({ ...validated.error.issues });
        log(errorMessage);
        return { error: { message: errorMessage }, success: false };
      }

      const [result] = await this.db
        .update(serviceAvailabilityTable)
        .set(validated.data)
        .where(eq(serviceAvailabilityTable.id, validated.data.id))
        .returning({ id: serviceAvailabilityTable.id });

      returnValue = {
        data: { id: result.id },
        success: true,
      };
    } else {
      return {
        error: { message: 'Invalid availability type' },
        success: false,
      };
    }

    return returnValue;
  }

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

  // hasKeysFromType<T>(availability: any, type: T): boolean {
  //   const requiredKeys = Object.keys(type) as (keyof T)[];
  //   return requiredKeys.every((key) => key in availability);
  // }

  // RecurringServiceAvailability type guard
  isRecurringServiceAvailability(
    availability: ServiceAvailability | RecurringAvailability
  ): availability is RecurringAvailability {
    return (
      (availability as RecurringAvailability).dayOfWeek !== undefined &&
      daysofWeek.includes((availability as RecurringAvailability).dayOfWeek) &&
      (availability as any).date === undefined
    );
  }

  isNonRecurringServiceAvailability(
    availability: ServiceAvailability | RecurringAvailability
  ): availability is ServiceAvailability {
    return !this.isRecurringServiceAvailability(availability);
  }
}
