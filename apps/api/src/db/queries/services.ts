import { eq } from 'drizzle-orm';
import { db } from '..';
import { InsertService, petServicesTable, SelectService } from '../services';

const initialServices: SelectService[] = [
  {
    createdAt: null,
    description: '30-minute walk',
    duration: '',
    frequency: 'daily',
    id: '1',
    ownerId: null,
    price: 20,
    type: 'pet-walking',
    updatedAt: null,
  },
  {
    createdAt: null,
    description: 'Includes feeding and litter box cleaning',
    duration: '',
    frequency: 'weekly',
    id: '2',
    ownerId: null,
    price: 15,
    type: 'pet-sitting',
    updatedAt: null,
  },
];

export async function createService(service: InsertService) {
  const newService = await db
    .insert(petServicesTable)
    .values(service)
    .returning({ insertId: petServicesTable.id });

  return newService?.[0] ?? null;
}

export async function getService(id: string): Promise<SelectService[]> {
  if (!id) return [];
  return await db
    .select()
    .from(petServicesTable)
    .where(eq(petServicesTable.id, id));
}

export async function getAllServices(): Promise<SelectService[]> {
  return new Promise((resolve) => {
    return resolve(initialServices);
  });
  // return await db.select().from(petServicesTable);
}

export async function updateService(service: SelectService) {
  return await db
    .update(petServicesTable)
    .set(service)
    .where(eq(petServicesTable.id, service.id))
    .returning({ id: petServicesTable.id });
}

export async function deleteService(id: string) {
  if (!id) return null;
  return await db
    .delete(petServicesTable)
    .where(eq(petServicesTable.id, id))
    .returning({ id: petServicesTable.id });
}

const OfferingService = {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
};

export default OfferingService;
