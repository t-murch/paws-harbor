import PetService from '@/db/queries/pets';
import { log } from '@repo/logger';
import {
  existingPetSchema,
  newPetSchema,
} from '@repo/shared/db/schemas/schema';
import { User } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { validator } from 'hono/validator';

type Variables = {
  user: User;
};

const petsRoute = new Hono<{ Variables: Variables }>();

petsRoute.post(
  '/new',
  validator('json', (val, context) => {
    const parsed = newPetSchema.safeParse(val);

    if (!parsed.success) {
      log(
        `Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`
      );
      return context.json({ message: 'CreatePet failure.. ' });
    }
    return parsed.data;
  }),
  async (context) => {
    const authUser = context.get('user');
    const newPet = context.req.valid('json');
    newPet.userId = authUser.id;

    const newPetId = await PetService.createPet(newPet);
    if (!newPetId) {
      log(`Failed to create new pet. UserId=${authUser.id}`);
      context.json({ data: newPet, error: 'Failed to create new pet. ' });
    }

    return context.json({ data: newPetId, error: null });
  }
);

petsRoute.get('/user', async (context) => {
  const user = context.get('user');
  const userPets = await PetService.getUserPets(user.id);

  return context.json({ data: userPets, error: null });
});

petsRoute.put(
  '/:id',
  validator('json', (val, context) => {
    const parsed = existingPetSchema.safeParse(val);

    if (!parsed.success) {
      log(
        `Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`
      );
      return context.json({ message: 'UpdatePet failure.. ' });
    }
    return parsed.data;
  }),
  async (context) => {
    const authUser = context.get('user');
    const petId = context.req.param('id');
    const petInput = context.req.valid('json');

    if (petId !== petInput.id || petInput.userId !== authUser.id) {
      const errorMessage = `Error on Pet Update. Mismatch at pet ID or attempt to edit non-owned pet.`;
      log(errorMessage);
      return context.json({ data: null, error: errorMessage });
    }

    const updatedPet = await PetService.updatePet(petInput);

    return context.json({ data: updatedPet, error: null });
  }
);

petsRoute.delete('/:id', async (context) => {
  const authUser = context.get('user');
  const petId = context.req.param('id');

  const existingPetIdx = (await PetService.getUserPets(authUser.id)).findIndex(
    (pet) => pet.userId === authUser.id
  );
  if (existingPetIdx === -1) {
    const errorMsg = `User does not own the pet to delete.`;
    console.error(errorMsg);
    return context.json({ error: { message: errorMsg }, success: false });
  }

  const response = await PetService.deletePet(petId);
  if (!response || response?.length < 1) {
    const errorMsg = `Failed to delete Pet.`;
    console.error(errorMsg);
    return context.json({ error: { message: errorMsg }, success: false });
  }
  console.debug(`response = ${JSON.stringify(response)}`);

  return context.json({ data: response.at(0), success: true });
});

export default petsRoute;
