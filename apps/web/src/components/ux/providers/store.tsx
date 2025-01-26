import { atom, Provider, useAtomValue, useSetAtom } from "jotai";
import { atomFamily, atomWithStorage, unwrap } from "jotai/utils";
import React from "react";
import { supabaseClient } from "../../../lib/supabase/client";
import { Pet } from "../../../lib/types";

// **** USER ****
export const sessionAtom = atom(async () => {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
});

const unwrappedSessionAtom = unwrap(sessionAtom, (prev) => prev ?? null);

export const userAtom = atom((get) => {
  const session = get(unwrappedSessionAtom);
  return session?.user ?? null;
});

// **** PETS ****
// Define a global atom to store all pet details
export const petsAtom = atom<Pet[]>([]);

// A helper function to create dynamic atoms for individual pet edits
// eslint-disable-next-line no-unused-vars
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

// **** PRICING ****
// Define the type for our pricing structure
type PricingStructure = Record<string, number>;

// Create an atom with storage to persist pricing data
const pricingAtom = atomWithStorage<PricingStructure>("pricing", {});

// Derived atom for getting a specific price
const getPriceAtom = atom(
  (get) => (serviceType: string) => get(pricingAtom)[serviceType] || 0,
);

// Derived atom for updating a price
const updatePriceAtom = atom(
  null,
  (get, set, update: { serviceType: string; price: number }) => {
    const currentPricing = get(pricingAtom);
    set(pricingAtom, {
      ...currentPricing,
      [update.serviceType]: update.price,
    });
  },
);

// Custom hook to use pricing functionality
export function usePricing() {
  const prices = useAtomValue(pricingAtom);
  const getPrice = useAtomValue(getPriceAtom);
  const updatePrice = useSetAtom(updatePriceAtom);

  return {
    getPrice,
    prices,
    updatePrice: (serviceType: string, price: number) =>
      updatePrice({ price, serviceType }),
  };
}
// ********

export function ContextStore({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
