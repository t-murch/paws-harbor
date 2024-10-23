import { z } from "zod";
import {
  ServiceSchema,
  InsertService,
  InsertServiceSchema,
  SelectService,
} from "@/../../../api/src/db/services";
import { serviceFrequencies, BASE_SERVICES } from "@/../../../api/src/types";

export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  weight?: number;
  specialNeeds?: string;
  sex: "male" | "female";
  size: PetSizeNames;
};

export type NewPet = Partial<Pet>;
export type CreateReadyPet = Omit<Pet, "id">;

export const PetSizes = {
  giant: [101, Infinity],
  large: [41, 100],
  medium: [16, 40],
  small: [0, 15],
} as const;

export const isValidNewPet = (newPet: NewPet): newPet is CreateReadyPet => {
  return (
    typeof newPet.name === "string" &&
    typeof newPet.species === "string" &&
    (newPet.species === "dog" || newPet.species === "cat") &&
    typeof newPet.breed === "string" &&
    typeof newPet.sex === "string" &&
    (newPet.sex === "male" || newPet.sex === "female") &&
    typeof newPet.size === "string" &&
    newPet.size in PetSizes
  );
};

export type PetSizeNames = keyof typeof PetSizes;
export type PetSizeScales = (typeof PetSizes)[PetSizeNames];
export const PetSizeKeys = [...Object.keys(PetSizes)];
const zodPetSizeKeys = ["small", "medium", "large", "giant"] as const;

export const getEmptyPet = (species: Pet["species"]): CreateReadyPet => ({
  age: 1,
  breed: "",
  name: "",
  sex: "female",
  size: "medium",
  specialNeeds: "",
  species: species,
});

export const newPetSchema = z.object({
  age: z.coerce.number(),
  breed: z.string().min(4),
  id: z.string().optional(),
  name: z.string().min(2),
  sex: z.union([z.literal("male"), z.literal("female")]),
  size: z.enum(zodPetSizeKeys),
  specialNeeds: z.string(),
  species: z.union([z.literal("dog"), z.literal("cat")]),
});
export const existingPetSchema = z.object({
  age: z.coerce.number(),
  breed: z.string().min(4),
  id: z.string(),
  name: z.string().min(2),
  sex: z.union([z.literal("male"), z.literal("female")]),
  size: z.enum(zodPetSizeKeys),
  specialNeeds: z.string().optional(),
  species: z.union([z.literal("dog"), z.literal("cat")]),
  userId: z.string().nullable(),
});

export type Service = {
  id: string;
  type: "pet-walking" | "pet-sitting" | "pet-bathing";
  frequency: "a-la-carte" | "recurring-monthly";
  notes?: string;
};

/**
 * DIRECT FROM SERVER
 */
export const frequencies = serviceFrequencies;
export const services = BASE_SERVICES;

// Example of Zod schema matching the `petServicesTable` structure
export const InsertServiceSchemaClient = InsertServiceSchema;
export const ServiceSchemaClient = ServiceSchema;
export type InsertServiceClient = InsertService;
export type SelectServiceClient = SelectService;

// // Define the service schema
// export const serviceSchema = z.object({
//   description: z.string().optional(),
//   frequency: z.enum(frequencies),
//   // frequency: z.string().min(1, "Frequency is required"),
//   id: z.string().optional(),
//   price: z.coerce.number().min(0, "Price must be a positive number"),
//   // type: z.enum(services),
//   type: z.string().min(1, "Service type is required"),
// });
//
export const serviceListSchema = z.object({
  services: z.array(ServiceSchema),
});

export type ServiceFormData = z.infer<typeof serviceListSchema>;
export type UserProfile2 = {
  id: string;
  name: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  pets: Pet[];
  services: Service[];
};
