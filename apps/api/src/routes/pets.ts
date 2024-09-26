import { existingPetSchema, newPetSchema } from "@/db/pets";
import PetService from "@/db/queries/pets";
import { log } from "@repo/logger";
import { User } from "@supabase/supabase-js";
import { Hono } from "hono";
import { validator } from "hono/validator";

type Variables = {
  user: User;
};

const petsRoute = new Hono<{ Variables: Variables }>()
  .post(
    "pets/new",
    validator("json", (val, context) => {
      const parsed = newPetSchema.safeParse(val);

      if (!parsed.success) {
        log(
          `Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`,
        );
        return context.json({ message: "CreatePet failure.. " });
      }
      return parsed.data;
    }),
    async (context) => {
      const authUser = context.get("user");
      const newPet = context.req.valid("json");
      newPet.userId = authUser.id;

      const newPetId = await PetService.createPet(newPet);
      if (!newPetId) {
        log(`Failed to create new pet. UserId=${authUser.id}`);
        context.json({ data: newPet, error: "Failed to create new pet. " });
      }

      return context.json({ data: newPetId, error: null });
    },
  )
  .get("pets/user", async (context) => {
    const user = context.get("user");
    const userPets = await PetService.getUserPets(user.id);

    return context.json({ data: userPets, error: null });
  })
  .post(
    "pets/:id",
    validator("json", (val, context) => {
      const parsed = existingPetSchema.safeParse(val);

      if (!parsed.success) {
        log(
          `Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`,
        );
        return context.json({ message: "UpdatePet failure.. " });
      }
      return parsed.data;
    }),
    async (context) => {
      const authUser = context.get("user");
      const petId = context.req.param("id");
      const petInput = context.req.valid("json");

      if (petId !== petInput.id || petInput.userId !== authUser.id) {
        const errorMessage = `Error on Pet Update. Mismatch at pet ID or attempt to edit non-owned pet.`;
        log(errorMessage);
        return context.json({ data: null, error: errorMessage });
      }

      const updatedPet = await PetService.updatePet(petInput);

      return context.json({ data: updatedPet, error: null });
    },
  );

export default petsRoute;
