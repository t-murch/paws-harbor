import {
  RequestServiceAvailability,
  serviceAvailabilityTable,
} from '@/db/availability';
import { AvailabilityRepository } from '@/db/queries/availability';
import { InsertProfile, profilesTable, SelectProfile } from '@/db/users';
import { eq } from 'drizzle-orm';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { assert, describe, expect, it, vi } from 'vitest';

const testUser: InsertProfile = {
  admin: true,
  email: `${crypto.randomUUID()}@testing.com`,
  name: 'Tobias Ruffin',
  role: 'admin',
};

describe('POST /api/service-availability', () => {
  let testDb: PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
  };
  let availabilityRepository: AvailabilityRepository;
  let insertProfile: SelectProfile;

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

  it('should create specific availability for an admin', async () => {
    const dbSpyInsert = vi.spyOn(testDb, 'insert');
    const requestSpy = vi.spyOn(
      availabilityRepository,
      'requestTypetoInsertType'
    );
    const availability: RequestServiceAvailability = {
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

    expect(requestSpy).toHaveBeenCalled();
    expect(requestSpy).toHaveBeenCalledWith(insertProfile.id, availability);
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
