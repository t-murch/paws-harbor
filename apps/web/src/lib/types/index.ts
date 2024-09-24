import { z } from "zod";

export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  weight?: number;
  specialNeeds?: string;
  gender: "male" | "female";
  size: PetSizeNames;
};

export type NewPet = Partial<Pet>;
export type CreateReadyPet = Omit<Pet, "id">;

export const PetSizes = {
  small: [0, 15],
  medium: [16, 40],
  large: [41, 100],
  giant: [101, Infinity],
} as const;

export const isValidNewPet = (newPet: NewPet): newPet is CreateReadyPet => {
  return (
    typeof newPet.name === "string" &&
    typeof newPet.species === "string" &&
    (newPet.species === "dog" || newPet.species === "cat") &&
    typeof newPet.breed === "string" &&
    typeof newPet.gender === "string" &&
    (newPet.gender === "male" || newPet.gender === "female") &&
    typeof newPet.size === "string" &&
    newPet.size in PetSizes
  );
};

export type PetSizeNames = keyof typeof PetSizes;
export type PetSizeScales = (typeof PetSizes)[PetSizeNames];
export const PetSizeKeys = [...Object.keys(PetSizes)];
const zodPetSizeKeys = ["small", "medium", "large", "giant"] as const;

export const getEmptyPet = (species: Pet["species"]): CreateReadyPet => ({
  name: "",
  species: species,
  breed: "",
  age: 1,
  specialNeeds: "",
  gender: "female",
  size: "medium",
});

export const newPetSchema = z.object({
  id: z.string().optional(),
  age: z.coerce.number(),
  breed: z.string().min(4),
  name: z.string().min(2),
  sex: z.union([z.literal("male"), z.literal("female")]),
  species: z.union([z.literal("dog"), z.literal("cat")]),
  specialNeeds: z.string(),
  size: z.enum(zodPetSizeKeys),
});
// export const existingPetSchema = z.object({
//   species: z.union([z.literal("dog"), z.literal("cat")]),
//   id: z.string(),
//   name: z.string(),
//   userId: z.string().nullable(),
//   breed: z.string().nullable(),
//   age: z.number().nullable(),
//   weight: z.string().nullable(),
//   specialNeeds: z.string().nullable(),
// });

export type Service = {
  id: string;
  type: "pet-walking" | "pet-sitting" | "pet-bathing";
  frequency: "a-la-carte" | "recurring-monthly";
  notes?: string;
};

export type UserProfile2 = {
  id: string;
  name: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  pets: Pet[];
  services: Service[];
};
