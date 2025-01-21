import {
  InsertPet,
  petsTable,
  SelectPet,
} from '@repo/shared/src/db/schemas/pets';
import { eq } from 'drizzle-orm';
import { db } from '..';

export async function createPet(pet: InsertPet) {
  const newRows = await db
    .insert(petsTable)
    .values(pet)
    .returning({ insertId: petsTable.id });

  return newRows.length ? newRows[0] : null;
}

export async function getUserPets(
  id: SelectPet['userId']
): Promise<SelectPet[]> {
  if (!id) return [];
  return await db.select().from(petsTable).where(eq(petsTable.userId, id));
}

export async function updatePet(pet: SelectPet) {
  const updatedPets = await db
    .update(petsTable)
    .set({ ...pet })
    .where(eq(petsTable.id, pet.id))
    .returning();

  return updatedPets.length ? updatedPets[0] : null;
}

export async function deletePet(petId: string) {
  if (!petId) return null;
  return await db
    .delete(petsTable)
    .where(eq(petsTable.id, petId))
    .returning({ id: petsTable.id });
}

const PetService = {
  createPet,
  deletePet,
  getUserPets,
  updatePet,
};

export default PetService;
