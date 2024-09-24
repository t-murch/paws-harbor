import { Pet } from "@/lib/types";
import { atomFamily, unwrap } from "jotai/utils";
import { atom, Provider } from "jotai";
import { supabaseClient } from "@/lib/supabase/client";
import React from "react";

// **** USER ****
export const sessionAtom = atom(async (get) => {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
});

const unwrappedSessionAtom = unwrap(sessionAtom, (prev) => prev ?? null);

export const userAtom = atom((get) => {
  const session = get(unwrappedSessionAtom);
  return session?.user ?? null;
});

// **** PETS ****
export const testPet: Pet = {
  id: "dog-id",
  age: 7,
  name: "Day-Z",
  breed: "American Terrier",
  gender: "female",
  size: "large",
  species: "dog",
};

// Define a global atom to store all pet details
export const petsAtom = atom<Pet[]>([testPet]);

// A helper function to create dynamic atoms for individual pet edits
const petEditAtom = (petId: string) =>
  atom(
    (get) => get(petsAtom).find((pet) => pet.id === petId),
    (_get, set, updatedPet: Pet) => set(petsAtom, [updatedPet]),
  );

export const petEditAtomFamily = atomFamily((petId: string) =>
  atom(
    (get) => get(petsAtom).find((pet) => pet.id === petId) || null,
    (get, set, updatedPet: Pet) => {
      const pets = get(petsAtom);
      set(
        petsAtom,
        pets.map((pet) => (pet.id === petId ? updatedPet : pet)),
      ); // Update the specific pet
    },
  ),
);

export function ContextStore({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
