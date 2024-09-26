import { db } from '..';
import { eq } from 'drizzle-orm';
import { InsertPet, petsTable, SelectPet } from '../pets';

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

const PetService = {
  createPet,
  getUserPets,
  updatePet,
};

export default PetService;
