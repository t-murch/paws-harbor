import {
  InsertServiceSchema,
  NewService,
  SelectRecurringAvailability,
  SelectServiceAvailability,
  SelectServiceSchema,
  Service,
  ServicePricingInsertDTOSchema,
} from "@repo/shared/db/schemas/schema";
import { serviceFrequencies } from "@repo/shared/server";
import {
  NewServicePricingT,
  ServicePricingService,
} from "@repo/shared/types/servicePricing";
import { z } from "zod";
import { ScheduleMeetingProps } from "../../components/ux/Scheduler";

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

export const InsertServiceSchemaClient = InsertServiceSchema;
export const ServiceSchemaClient = SelectServiceSchema;
export type InsertServiceClient = NewService;
export type SelectServiceClient = Service;
export type ServiceClient = InsertServiceClient | SelectServiceClient;

export const serviceListSchema = z.object({
  services: z.array(ServicePricingInsertDTOSchema),
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

export function transformServiceFormToSchema(formData: {
  [k: string]: FormDataEntryValue;
}): z.infer<typeof ServicePricingService.NewServicePricingSchema>[] {
  console.log(
    `transformServiceFormToSchema`,
    JSON.stringify(formData, null, 2),
  );

  // First, group all form fields by service index
  const serviceKeys = Object.keys(formData)
    .filter((key) => key.startsWith("services."))
    .reduce(
      (acc, key) => {
        const match = key.match(/services\.(\d+)\.(.*)/);
        if (match) {
          const [, index, attribute] = match;
          if (!acc[index]) acc[index] = {};

          // Handle nested durationOptions
          if (attribute.startsWith("durationOptions.")) {
            const durationMatch = attribute.match(
              /durationOptions\.(\d+)\.(.*)/,
            );
            if (durationMatch) {
              const [, durationIndex, durationAttribute] = durationMatch;
              if (!acc[index].durationOptions) acc[index].durationOptions = {};
              if (!acc[index].durationOptions[durationIndex]) {
                acc[index].durationOptions[durationIndex] = {};
              }
              acc[index].durationOptions[durationIndex][durationAttribute] =
                formData[key];
            }
          } else {
            acc[index][attribute] = formData[key];
          }
        }
        return acc;
      },
      {} as Record<string, any>,
    );

  // Convert the object to an array and transform
  return Object.values(serviceKeys).map((service) => {
    // Handle metadata
    const metadata: Record<string, unknown> = {};
    const metadataPrefix = "metadata.";
    Object.keys(service)
      .filter((key) => key.startsWith(metadataPrefix))
      .forEach((key) => {
        const metadataKey = key.slice(metadataPrefix.length);
        let value: unknown = service[key];
        if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (!isNaN(Number(value))) value = Number(value);
        metadata[metadataKey] = value;
      });

    // Transform duration options from object to array
    const durationOptions: NewServicePricingT["durationOptions"] =
      service.durationOptions
        ? Object.values(service.durationOptions).map((option: any) => ({
            createdAt:
              new Date(option.createdAt).toString() !== "Invalid Date"
                ? new Date(option.createdAt)
                : undefined,
            durationUnit: option.durationUnit,
            durationValue: Number(option.durationValue),
            serviceId: option.serviceId || "",
            tierLevel: Number(option.tierLevel),
            tieredRate: option.tieredRate ? String(option.tieredRate) : "0.00",
          }))
        : [];

    // Transform discounts if present
    const discounts = service.discounts
      ? (Array.isArray(service.discounts)
          ? service.discounts
          : [service.discounts]
        ).map((discount: any) => ({
          isApplied:
            discount.isApplied === "true" || discount.isApplied === true,
          type: discount.type as "percentage" | "fixed",
          value: Number(discount.value),
        }))
      : [];

    const transformedService: z.infer<
      typeof ServicePricingService.NewServicePricingSchema
    > = {
      baseRate: service.baseRate ? Number(service.baseRate) : undefined,
      description: service.description,
      discounts,
      durationOptions,
      isTiered: service.isTiered === "true" || service.isTiered === true,
      metadata,
      name: service.name,
      userSpecificRate: service.userSpecificRate
        ? Number(service.userSpecificRate)
        : undefined,
    };

    // Add optional fields if they exist
    for (const k of ["id", "createdAt", "updatedAt"] as const) {
      if (k in service) {
        if (k === "createdAt" || k === "updatedAt") {
          transformedService[k] = new Date(service[k]);
        } else {
          transformedService[k] = service[k];
        }
      }
    }

    console.log(
      `Transformed service: ${JSON.stringify(transformedService, null, 2)}`,
    );
    return transformedService;
  });
}

/** start && end are specifically datetime formatted strings */
export type SchedulerType = {
  date: Date;
  serviceType: SelectServiceAvailability["serviceType"];
} & ScheduleMeetingProps["availableTimeslots"][number];

export function transformAvailabilityToScheduleType(
  availability: SelectServiceAvailability,
): SchedulerType {
  return {
    date: new Date(availability.date),
    endTime: new Date(
      new Date(availability.date).setHours(
        parseInt(availability.endTime.split(":")[0]),
      ),
    ),
    id: availability.id,
    serviceType: availability.serviceType,
    startTime: new Date(
      new Date(availability.date).setHours(
        parseInt(availability.startTime.split(":")[0]),
      ),
    ),
  };
}

/** recurring availability has a 1 - many relationship */
export function transformRecurringToScheduleType(
  availability: SelectRecurringAvailability,
): SchedulerType[] {
  const dates: Date[] = [],
    currentEndDate =
      availability.endDate ??
      new Date(new Date().setDate(new Date().getDate() + 90)).toISOString();
  let currentDate = new Date(availability.startDate);

  while (currentDate <= new Date(currentEndDate)) {
    dates.push(currentDate);
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
  }

  return dates.map((date) => ({
    date,
    endTime: new Date(
      new Date(date).setHours(parseInt(availability.endTime.split(":")[0])),
    ),
    id: availability.id,
    serviceType: availability.serviceType,
    startTime: new Date(
      new Date(date).setHours(parseInt(availability.startTime.split(":")[0])),
    ),
  }));
}
