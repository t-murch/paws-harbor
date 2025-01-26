import z from 'zod';
import { Pricing, Service } from '../db/schemas/services';

type ServicePricingDetails = Service & {
  durationOptions: Pricing[];
  baseRate?: number;
  discounts?: {
    type: 'percentage' | 'fixed';
    value: number;
    isApplied: boolean;
  }[];
  userSpecificRate?: number;
};
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type NewServicePricingDetails = PartialBy<
  ServicePricingDetails,
  'createdAt' | 'id' | 'updatedAt'
> & {
  durationOptions: PartialBy<
    ServicePricingDetails['durationOptions'][number],
    'createdAt' | 'id' | 'serviceId'
  >[];
  metadata: Record<string, unknown>;
};

const DurationOptionSchema = z.object({
  createdAt: z.date().optional(),
  durationUnit: z.string(),
  durationValue: z.number().or(z.string().pipe(z.coerce.number())),
  id: z.number(),
  serviceId: z.string(),
  tierLevel: z.number().or(z.string().pipe(z.coerce.number())),
  tieredRate: z.union([z.number(), z.string()]).transform(String),
});
const NewDurationOptionSchema = DurationOptionSchema.extend({
  createdAt: z.string().datetime().optional(),
  id: z.number().optional(),
  serviceId: z.string().optional(),
});
type NewDurationOption = z.infer<typeof NewDurationOptionSchema>;

const ServicePricingSchema = z.object({
  baseRate: z
    .union([z.number(), z.string()])
    .pipe(z.coerce.number())
    .optional(),
  createdAt: z.date(),
  description: z.string(),
  discounts: z
    .array(
      z.object({
        isApplied: z.boolean(),
        type: z.enum(['percentage', 'fixed']),
        value: z.number().or(z.string().pipe(z.coerce.number())),
      })
    )
    .optional(),
  durationOptions: z.array(DurationOptionSchema),
  id: z.string(),
  isTiered: z.boolean().or(z.string().pipe(z.coerce.boolean())).optional(),
  metadata: z.record(z.string(), z.unknown()),
  name: z.string(),
  updatedAt: z.date(),
  userSpecificRate: z.number().optional(),
});
const NewServicePricingSchema = ServicePricingSchema.extend({
  createdAt: z.date().optional(),
  durationOptions: z.array(
    DurationOptionSchema.extend({
      createdAt: z.date().optional(),
      id: z.number().optional(),
      serviceId: z.string().optional(),
    })
  ),
  id: z.string().optional(),
  updatedAt: z.date().optional(),
});
type ServicePricingT = z.infer<typeof ServicePricingSchema>;
type NewServicePricingT = z.infer<typeof NewServicePricingSchema>;

function parsePersistedServicePricing(sp: ServicePricingDetails): {
  pricing: Pricing[];
  service: Service;
} {
  return {
    pricing: sp.durationOptions.map((d) => ({
      ...d,
    })),
    service: {
      ...sp,
    },
  };
}

function isPricing(obj: any): obj is Pricing {
  return (
    obj &&
    typeof obj.durationUnit === 'string' &&
    typeof obj.durationValue === 'number' &&
    typeof obj.id === 'number' &&
    typeof obj.serviceId === 'number' &&
    typeof obj.tierLevel === 'number' &&
    typeof obj.tieredRate === 'number'
  );
}

export const ServicePricingService = {
  DurationOptionSchema,
  NewServicePricingSchema,
  ServicePricingSchema,
  isPricing,
  parsePersistedServicePricing,
};

export {
  type NewDurationOption,
  type NewServicePricingDetails,
  type NewServicePricingT,
  type PartialBy,
  type ServicePricingDetails,
  type ServicePricingT,
};
