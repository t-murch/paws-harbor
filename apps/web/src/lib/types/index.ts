import {
  InsertServiceSchema,
  NewService,
  SelectServiceSchema,
  Service,
} from "@/../../../api/src/db/services";
import { serviceFrequencies } from "@/../../../api/src/types";
import { log } from "@repo/logger";
import { z } from "zod";
import { ServicePricing } from "../../../../api/src/types/pricing";

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

export type ServiceT = {
  id: string;
  type: "pet-walking" | "pet-sitting" | "pet-bathing";
  frequency: "a-la-carte" | "recurring-monthly";
  notes?: string;
};

/**
 * DIRECT FROM SERVER
 */
export const frequencies = serviceFrequencies;
// export const services = BASE_SERVICES;

// Example of Zod schema matching the `petServicesTable` structure
export const InsertServiceSchemaClient = InsertServiceSchema;
export const ServiceSchemaClient = SelectServiceSchema;
export type InsertServiceClient = NewService;
export type SelectServiceClient = Service;
export type ServiceClient = InsertServiceClient | SelectServiceClient;

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
  services: z.array(InsertServiceSchema),
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

export type CreateResponse<T> =
  | {
      data: T;
      success: true;
    }
  | {
      error: string;
      success: false;
    };

const AdminServiceFormSchema = z.object({
  services: z.record(z.string(), InsertServiceSchema),
});

type AdminServiceForm = z.infer<typeof AdminServiceFormSchema>;

export function transformServiceFormToSchema(formData: {
  [k: string]: FormDataEntryValue;
}): z.infer<typeof InsertServiceSchema | typeof SelectServiceSchema>[] {
  const serviceKeys = Object.keys(formData)
    .filter((key) => key.startsWith("services."))
    .reduce(
      (acc, key) => {
        const match = key.match(/services\.(\d+)\.(.*)/);
        if (match) {
          const [, index, attribute] = match;
          if (!acc[index]) acc[index] = {};
          acc[index][attribute] = formData[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

  // Convert the object to an array and transform
  return Object.values(serviceKeys).map((service) => {
    // Dynamically handle metadata
    const metadata: Record<string, unknown> = {};
    const metadataPrefix = "metadata.";
    Object.keys(service)
      .filter((key) => key.startsWith(metadataPrefix))
      .forEach((key) => {
        const metadataKey = key.slice(metadataPrefix.length);
        // Try to parse numbers, booleans, or keep as string
        let value: unknown = service[key];
        if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (!isNaN(Number(value))) value = Number(value);
        metadata[metadataKey] = value;
      });

    // Dynamically handle addons
    const addons: Record<string, number> = {};
    const addonsPrefix = "pricingModel.addons.";
    Object.keys(service)
      .filter((key) => key.startsWith(addonsPrefix))
      .forEach((key) => {
        const addonKey = key.slice(addonsPrefix.length);
        addons[addonKey] = parseFloat(service[key] || "0");
      });

    const pricingModel: ServicePricing = parsePricingModel(service, addons);

    const transformedService: ServiceClient = {
      description: service.description,
      metadata,
      name: service.name,
      pricingModel,
    };

    log(`service=${JSON.stringify(service, null, 2)}`);

    if ("id" in service) {
      transformedService.id = service.id;
    }

    if ("createdAt" in service) {
      transformedService.createdAt = service.createdAt;
    }

    if ("updatedAt" in service) {
      transformedService.updatedAt = service.updatedAt;
    }

    return transformedService;
  });
}

function parsePricingModel(
  service: any,
  addons: Record<string, number>,
): ServicePricing {
  if (service["pricingModel.type"] === "baseRate") {
    return {
      additionalPrice: parseFloat(service["pricingModel.additionalPrice"]),
      additionalTime: parseFloat(service["pricingModel.additionalTime"]),
      addons,
      basePrice: parseFloat(service["pricingModel.basePrice"]),
      baseTime: parseFloat(service["pricingModel.baseTime"]),
      timeUnit: service["pricingModel.timeUnit"],
      type: service["pricingModel.type"],
    };
  } else {
    const tiers: Record<string, number> = {};

    Object.keys(service)
      .filter((key) => key.startsWith("pricingModel.tiers."))
      .forEach((key) => {
        const tierKey = key.slice("pricingModel.tiers.".length);
        tiers[tierKey] = parseFloat(service[key]);
      });

    return {
      tierMapping: JSON.parse(service["pricingModel.tierMapping"] ?? "[]"),
      tiers: tiers,
      type: service["pricingModel.type"],
    };
  }
}
