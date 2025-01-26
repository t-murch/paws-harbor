import { AvailabilityRepository } from '@/db/queries/availability';
import {
  InsertProfile,
  InsertRecurringAvailability,
  InsertServiceAvailability,
  profilesTable,
  RecurringAvailability,
  recurringAvailabilityTable,
  RequestRecurringServiceAvailability,
  RequestServiceAvailability,
  SelectProfile,
  SelectServiceAvailability,
  serviceAvailabilityTable,
  UpdateRecurringAvailability,
} from '@repo/shared/db/schemas/schema';
import { eq } from 'drizzle-orm';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context, Next } from 'hono';
import postgres from 'postgres';
import { assert, describe, expect, it, vi } from 'vitest';

const testUser: InsertProfile = {
  admin: true,
  email: `${crypto.randomUUID()}@testing.com`,
  name: 'Tobias Ruffin',
  role: 'admin',
};

// Mock the authClient function
vi.mock('@/db/auth', () => ({
  authClient: vi.fn(),
}));

describe('AvailabilityRepository', () => {
  let testDb: PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
  };
  let availabilityRepository: AvailabilityRepository;
  let insertProfile: SelectProfile;
  // eslint-disable-next-line no-unused-vars
  let context: Context;
  // eslint-disable-next-line no-unused-vars
  let next: Next;

  beforeEach(() => {
    // Create a mock context and next function
    context = {
      json: vi.fn(),
      req: {
        header: vi.fn().mockReturnValue('base64-token'),
      },
      set: vi.fn(),
    } as unknown as Context;

    next = vi.fn();
  });

  beforeAll(async () => {
    const client = postgres(
      'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
      { prepare: false }
    );
    testDb = drizzle({ client, logger: true });

    availabilityRepository = new AvailabilityRepository(testDb);

    [insertProfile] = await testDb
      .insert(profilesTable)
      .values(testUser)
      .returning();
    console.log(`insertProfile=${JSON.stringify(insertProfile)}`);
  });

  afterAll(async () => {
    await testDb
      .delete(profilesTable)
      .where(eq(profilesTable.id, insertProfile.id));
    await testDb.$client.end();
  });

  describe('serviceAvailability', () => {
    it('should create specific availability for an admin', async () => {
      const dbSpyInsert = vi.spyOn(testDb, 'insert'),
        availability: RequestServiceAvailability = {
          date: '2024-12-04',
          endTime: '17:00:00',
          serviceType: 'pet-walking',
          startTime: '09:00:00',
        };

      const result = await availabilityRepository.createAvailability(
        availability,
        insertProfile.id
      );
      assert(result.success === true);
      expect(result).toEqual({
        data: {
          id: expect.any(String),
        },
        success: true,
      });

      expect(dbSpyInsert).toHaveBeenCalledTimes(1);
      expect(dbSpyInsert).toHaveBeenCalledWith(serviceAvailabilityTable);

      const [testQuery] = await testDb
        .select()
        .from(serviceAvailabilityTable)
        .where(eq(serviceAvailabilityTable.id, result.data.id));

      expect(testQuery).toBeDefined();
      expect(testQuery).toHaveProperty('id');
      expect(testQuery).toHaveProperty('adminId', insertProfile.id);
      expect(testQuery).toHaveProperty('date', availability.date);
      expect(testQuery).toHaveProperty('endTime', availability.endTime);
      expect(testQuery).toHaveProperty('serviceType', availability.serviceType);
      expect(testQuery).toHaveProperty('startTime', availability.startTime);

      await testDb
        .delete(serviceAvailabilityTable)
        .where(eq(serviceAvailabilityTable.id, result.data.id));
    });

    it('should get specific availability for an admin', async () => {
      const dbSpySelect = vi.spyOn(testDb, 'select'),
        availability: InsertServiceAvailability = {
          adminId: insertProfile.id,
          date: '2024-12-04',
          endTime: '17:00:00',
          serviceType: 'pet-walking',
          startTime: '10:00:00',
        };

      const [testQuery] = await testDb
        .insert(serviceAvailabilityTable)
        .values(availability)
        .returning();
      assert(testQuery !== undefined);

      const result = await availabilityRepository.getAvailability(testQuery.id);
      expect(result).toEqual({
        data: testQuery,
        success: true,
      });

      expect(dbSpySelect).toHaveBeenCalledTimes(1);

      await testDb
        .delete(serviceAvailabilityTable)
        .where(eq(serviceAvailabilityTable.id, testQuery.id));
    });

    it('should update specific availability for an admin', async () => {
      const dbSpyUpdate = vi.spyOn(testDb, 'update'),
        endTimes = ['17:00:00', '19:00:00'],
        anId = crypto.randomUUID(),
        createdWhen = new Date('2024-12-06T23:10:46.09114'),
        availability1: SelectServiceAvailability = {
          adminId: insertProfile.id,
          createdAt: createdWhen,
          date: '2024-12-04',
          endTime: endTimes[0],
          id: anId,
          serviceType: 'pet-walking',
          startTime: '10:00:00',
          updatedAt: new Date(),
        },
        availability2: SelectServiceAvailability = {
          adminId: insertProfile.id,
          createdAt: createdWhen,
          date: '2024-12-04',
          endTime: endTimes[1],
          id: anId,
          serviceType: 'pet-walking',
          startTime: '10:00:00',
          updatedAt: new Date(),
        };

      await testDb.insert(serviceAvailabilityTable).values(availability1);
      const [testQuery1] = await testDb
        .select()
        .from(serviceAvailabilityTable)
        .where(eq(serviceAvailabilityTable.id, anId));
      assert(testQuery1 !== undefined);

      const result = await availabilityRepository.updateAvailability(
        availability2,
        insertProfile.id
      );
      // assert(result.success === true);
      expect(result).toEqual({
        data: {
          id: expect.any(String),
        },
        success: true,
      });

      const [testQuery2] = await testDb
        .select()
        .from(serviceAvailabilityTable)
        .where(eq(serviceAvailabilityTable.id, anId));
      assert(testQuery2 !== undefined);
      expect(testQuery2).toHaveProperty('id', anId);
      expect(testQuery2).toHaveProperty('adminId', insertProfile.id);
      expect(testQuery2).toHaveProperty('date', availability2.date);
      expect(testQuery2).toHaveProperty('endTime', availability2.endTime);
      expect(testQuery2).toHaveProperty(
        'serviceType',
        availability2.serviceType
      );
      expect(testQuery2).toHaveProperty('startTime', availability2.startTime);

      expect(dbSpyUpdate).toHaveBeenCalledTimes(1);
      expect(dbSpyUpdate).toHaveBeenCalledWith(serviceAvailabilityTable);
      await testDb
        .delete(serviceAvailabilityTable)
        .where(eq(serviceAvailabilityTable.id, anId));
    });

    it('should delete specific availability for an admin', async () => {
      const dbSpyDelete = vi.spyOn(testDb, 'delete'),
        availability: InsertServiceAvailability = {
          adminId: insertProfile.id,
          date: '2024-12-04',
          endTime: '17:00:00',
          serviceType: 'pet-walking',
          startTime: '10:00:00',
        };

      const [testQuery] = await testDb
        .insert(serviceAvailabilityTable)
        .values(availability)
        .returning();
      assert(testQuery !== undefined);

      const result = await availabilityRepository.deleteAvailability(
        testQuery.id
      );
      expect(result).toEqual({
        data: { id: testQuery.id },
        success: true,
      });

      expect(dbSpyDelete).toHaveBeenCalledTimes(1);
    });

    it('should reject availability with invalid input', async () => {
      const invalidData = { date: '2024-12-04', service_type: 'invalid_type' };

      const result = await availabilityRepository.createAvailability(
        invalidData as unknown as RequestServiceAvailability
      );
      expect(result).toEqual({
        error: {
          message: expect.stringContaining(
            'Create Availability Validation failed. Errors:'
          ),
        },
        success: false,
      });
    });
  });

  describe('recurring availability', () => {
    it('should create recurring availability for admin user', async () => {
      const dbSpyInsert = vi.spyOn(testDb, 'insert'),
        availability: RequestRecurringServiceAvailability = {
          dayOfWeek: 'monday',
          endDate: '2024-12-11',
          endTime: '17:00:00',
          serviceType: 'pet-walking',
          startDate: '2024-12-04',
          startTime: '09:00:00',
        };

      const result = await availabilityRepository.createAvailability(
        availability,
        insertProfile.id
      );
      expect(result).toEqual({
        data: {
          id: expect.any(String),
        },
        success: true,
      });

      assert(result.success === true);
      const [testQuery] = await testDb
        .select()
        .from(recurringAvailabilityTable)
        .where(eq(recurringAvailabilityTable.id, result.data.id));

      expect(testQuery).toBeDefined();
      expect(testQuery).toHaveProperty('id');
      expect(testQuery).toHaveProperty('adminId', insertProfile.id);
      expect(testQuery).toHaveProperty('dayOfWeek', availability.dayOfWeek);
      expect(testQuery).toHaveProperty('endDate', availability.endDate);
      expect(testQuery).toHaveProperty('endTime', availability.endTime);
      expect(testQuery).toHaveProperty('serviceType', availability.serviceType);
      expect(testQuery).toHaveProperty('startDate', availability.startDate);
      expect(testQuery).toHaveProperty('startTime', availability.startTime);

      expect(dbSpyInsert).toHaveBeenCalledTimes(1);
      expect(dbSpyInsert).toHaveBeenCalledWith(recurringAvailabilityTable);
      await testDb
        .delete(recurringAvailabilityTable)
        .where(eq(recurringAvailabilityTable.id, result.data.id));
    });

    it('should get specific availability for an admin', async () => {
      const dbSpySelect = vi.spyOn(testDb, 'select'),
        availability: InsertRecurringAvailability = {
          adminId: insertProfile.id,
          dayOfWeek: 'monday',
          endDate: null,
          endTime: '17:00:00',
          serviceType: 'pet-walking',
          startDate: '2024-12-06',
          startTime: '10:00:00',
        };

      const [testQuery] = await testDb
        .insert(recurringAvailabilityTable)
        .values(availability)
        .returning();
      assert(testQuery !== undefined);

      const result = await availabilityRepository.getAvailability(
        testQuery.id,
        true
      );
      expect(result).toEqual({
        data: testQuery,
        success: true,
      });
      expect(dbSpySelect).toHaveBeenCalledTimes(1);

      await testDb
        .delete(recurringAvailabilityTable)
        .where(eq(recurringAvailabilityTable.id, testQuery.id));
    });

    it('should update specific recurring availability for an admin', async () => {
      const dbSpyUpdate = vi.spyOn(testDb, 'update'),
        endTimes = ['17:00:00', '19:00:00'],
        anId = crypto.randomUUID(),
        createdWhen = new Date('2024-12-06T23:10:46.09114'),
        availability1: InsertRecurringAvailability = {
          adminId: insertProfile.id,
          createdAt: createdWhen,
          dayOfWeek: 'monday',
          endDate: null,
          endTime: endTimes[0],
          id: anId,
          serviceType: 'pet-walking',
          startDate: '2024-12-04',
          startTime: '09:00:00',
        },
        availability2: UpdateRecurringAvailability = {
          dayOfWeek: 'monday',
          endDate: '2024-12-11',
          endTime: endTimes[1],
          id: anId,
        };

      const [insertQuery] = await testDb
        .insert(recurringAvailabilityTable)
        .values(availability1)
        .returning();
      assert(insertQuery !== undefined);

      const result = await availabilityRepository.updateAvailability(
        availability2,
        insertProfile.id
      );
      assert(result.success === true);
      expect(result).toEqual({
        data: {
          id: expect.any(String),
        },
        success: true,
      });
      expect(dbSpyUpdate).toHaveBeenCalledTimes(1);
      expect(dbSpyUpdate).toHaveBeenCalledWith(recurringAvailabilityTable);

      await testDb
        .delete(recurringAvailabilityTable)
        .where(eq(recurringAvailabilityTable.id, insertQuery.id));
    });

    it('should delete specific availability for an admin', async () => {
      const dbSpyDelete = vi.spyOn(testDb, 'delete'),
        availability: InsertRecurringAvailability = {
          adminId: insertProfile.id,
          dayOfWeek: 'monday',
          endTime: '17:00:00',
          serviceType: 'pet-walking',
          startDate: '2024-12-04',
          startTime: '10:00:00',
        };

      const [testQuery] = await testDb
        .insert(recurringAvailabilityTable)
        .values(availability)
        .returning();
      assert(testQuery !== undefined);

      const result = await availabilityRepository.deleteAvailability(
        testQuery.id,
        true
      );
      expect(result).toEqual({
        data: { id: testQuery.id },
        success: true,
      });
      expect(dbSpyDelete).toHaveBeenCalledTimes(1);
    });

    it('should reject availability with invalid input', async () => {
      const invalidData = { date: '2024-12-04', service_type: 'invalid_type' };

      const result = await availabilityRepository.createAvailability(
        invalidData as unknown as RequestRecurringServiceAvailability
      );
      expect(result).toEqual({
        error: {
          message: expect.stringContaining(
            'Create Availability Validation failed. Errors:'
          ),
        },
        success: false,
      });
    });
  });

  describe('requestTypetoInsertType', () => {
    it('should correctly transform request to insert type', () => {
      const requestData = {
        date: new Date('2024-01-15'),
        endTime: '17:00',
        serviceType: 'CLEANING',
        startTime: '09:00',
      };

      const result = availabilityRepository.requestTypetoInsertType(
        'admin-123',
        requestData as unknown as RequestServiceAvailability
      );

      expect(result).toEqual({
        ...requestData,
        adminId: 'admin-123',
        date: expect.any(String),
        endTime: expect.any(String),
        startTime: expect.any(String),
      });

      // Verify that date and times are converted to strings
      expect(typeof result.date).toBe('string');
      expect(typeof result.startTime).toBe('string');
      expect(typeof result.endTime).toBe('string');
    });
  });

  describe('isInsertServiceAvailability type guard', () => {
    it('should correctly identify InsertServiceAvailability', () => {
      const insertType = {
        adminId: 'admin-123',
        date: '2024-01-15',
        endTime: '17:00',
        serviceType: 'CLEANING',
        startTime: '09:00',
      };

      const requestType = {
        date: '2024-01-15',
        endTime: '17:00',
        serviceType: 'CLEANING',
        startTime: '09:00',
      };

      expect(
        availabilityRepository.isInsertServiceAvailability(insertType as any)
      ).toBe(true);
      expect(
        availabilityRepository.isInsertServiceAvailability(requestType as any)
      ).toBe(false);
    });
  });

  describe('isRecurringAvailability type guard', () => {
    it('should correctly identify recurring availability', () => {
      const badType: RequestServiceAvailability = {
        date: '2024-01-15',
        endTime: '17:00',
        serviceType: 'pet-walking',
        startTime: '09:00',
      };

      const goodType: RecurringAvailability = {
        adminId: 'admin-123',
        dayOfWeek: 'monday',
        endDate: '2024-01-15',
        endTime: '17:00',
        serviceType: 'pet-walking',
        startDate: '2024-01-15',
        startTime: '09:00',
      };

      expect(
        availabilityRepository.isRecurringServiceAvailability(badType as any)
      ).toBe(false);
      expect(
        availabilityRepository.isRecurringServiceAvailability(goodType)
      ).toBe(true);
    });
  });
});
