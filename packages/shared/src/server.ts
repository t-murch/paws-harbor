import z from 'zod';

export const BASE_SERVICES = [
  'pet-walking',
  'pet-sitting',
  'pet-bathing',
] as const;

export type BaseService = (typeof BASE_SERVICES)[number];
type CustomService = string & {};
export type ServiceType = BaseService | CustomService;
export const ServiceTypesEnum = z.enum(BASE_SERVICES);

export const durationUnit = [`mins`, `hours`, `days`] as const;

export const baseServiceFormValues = [
  { label: 'Pet Walking', value: 'pet-walking' },
  { label: 'Pet Sitting', value: 'pet-sitting' },
  { label: 'Pet Bathing', value: 'pet-bathing' },
] as const;

export type TimeUnit = 'mins' | 'hours' | 'days';

export interface BaseRatePricing {
  type: 'baseRate';
  basePrice: number;
  additionalPrice: number;
  baseTime: number;
  additionalTime: number;
  timeUnit: TimeUnit;
  addons: Record<string, number>;
}

export interface TieredPricing {
  type: 'tiered';
  tiers: Record<string, number>;
  tierMapping: {
    description: string;
    criteria: string;
  }[];
}

export type ServicePricing = BaseRatePricing | TieredPricing;

export function isBaseRatePricing(
  pricing: ServicePricing
): pricing is BaseRatePricing {
  return pricing.type === 'baseRate';
}

export function isTieredPricing(
  pricing: ServicePricing
): pricing is TieredPricing {
  return pricing.type === 'tiered';
}

export const serviceFrequencies = [
  'a-la-carte',
  'daily',
  'weekly',
  'monthly',
] as const;
export type ServiceFrequency = (typeof serviceFrequencies)[number];
export const ServiceFrequencyEnum = z.enum(serviceFrequencies);

export const daysofWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
export type DaysofWeek = (typeof daysofWeek)[number];
export const DaysofWeekEnum = z.enum(daysofWeek);

/**
 * MINUTES OR DAYS
 */
export interface Pricing {
  sitting: {
    basePrice: number;
    baseTime: number;
    additionalPrice: number;
    additionalTime: number;
    overnightFee: number;
    weekendFee: number;
  };
  walking: {
    basePrice: number;
    baseTime: number;
    additionalPrice: number;
    additionalTime: number;
  };
  bathing: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  subscription: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export const BASE_PRICES: Pricing = {
  bathing: {
    large: 100,
    medium: 75,
    small: 50,
    xlarge: 125,
  },
  sitting: {
    additionalPrice: 40,
    additionalTime: 60,
    basePrice: 50,
    baseTime: 60,
    overnightFee: 100,
    weekendFee: 250,
  },
  subscription: {
    daily: 30,
    monthly: 700,
    weekly: 180,
  },
  walking: {
    additionalPrice: 5,
    additionalTime: 15,
    basePrice: 15,
    baseTime: 30,
  },
};

interface BaseServiceFields {
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  pricingModel: ServicePricing;
  isBase: boolean;
}

export interface NewServiceConfig extends BaseServiceFields {
  id?: never;
}

export interface PersistedServiceConfig extends BaseServiceFields {
  id: string;
}

export type ServiceConfig = NewServiceConfig | PersistedServiceConfig;
