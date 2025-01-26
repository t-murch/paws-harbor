import {
  BASE_PRICES,
  BaseRatePricing,
  isBaseRatePricing,
  isTieredPricing,
  NewServiceConfig,
  PersistedServiceConfig,
  ServiceConfig,
  ServicePricing,
  TieredPricing,
  TimeUnit,
} from '@repo/shared/server';

// Type guards
function isPersisted(
  service: ServiceConfig
): service is PersistedServiceConfig {
  return 'id' in service && typeof service.id === 'string';
}

function isNew(service: ServiceConfig): service is NewServiceConfig {
  return !('id' in service);
}

// Database schemas
interface BaseRatePricingSchema {
  id: string;
  serviceId: string;
  basePrice: number;
  additionalPrice: number;
  baseTime: number;
  additionalTime: number;
  timeUnit: TimeUnit;
  addons: string; // JSON string of Record<string, number>
}

interface TieredPricingSchema {
  id: string;
  serviceId: string;
  tiers: string; // JSON string of Record<string, number>
  tierMapping: string; // JSON string of mapping array
}

// Pricing calculator utilities
class PricingCalculator {
  static calculateBaseRatePrice(
    pricing: BaseRatePricing,
    duration: number,
    selectedAddons: string[] = []
  ): number {
    let total = pricing.basePrice;

    // Calculate additional time charges
    if (duration > pricing.baseTime) {
      const additionalUnits = Math.ceil(
        (duration - pricing.baseTime) / pricing.additionalTime
      );
      total += additionalUnits * pricing.additionalPrice;
    }

    // Add selected addons
    total += selectedAddons.reduce(
      (sum, addon) => sum + (pricing.addons[addon] || 0),
      0
    );

    return total;
  }

  static calculateTieredPrice(pricing: TieredPricing, tier: string): number {
    return pricing.tiers[tier] || 0;
  }
}

// Database mappers
class PricingMapper {
  static toDatabase(serviceConfig: ServiceConfig): unknown {
    if (isBaseRatePricing(serviceConfig.pricingModel)) {
      return {
        additionalPrice: serviceConfig.pricingModel.additionalPrice,
        additionalTime: serviceConfig.pricingModel.additionalTime,
        addons: JSON.stringify(serviceConfig.pricingModel.addons),
        basePrice: serviceConfig.pricingModel.basePrice,
        baseTime: serviceConfig.pricingModel.baseTime,
        serviceId: serviceConfig.id,
        timeUnit: serviceConfig.pricingModel.timeUnit,
      };
    }

    if (isTieredPricing(serviceConfig.pricingModel)) {
      return {
        serviceId: serviceConfig.id,
        tierMapping: JSON.stringify(serviceConfig.pricingModel.tierMapping),
        tiers: JSON.stringify(serviceConfig.pricingModel.tiers),
      };
    }

    throw new Error('Unknown pricing model');
  }

  static fromDatabase(
    dbRecord: BaseRatePricingSchema | TieredPricingSchema,
    serviceType: 'baseRate' | 'tiered'
  ): ServicePricing {
    if (serviceType === 'baseRate') {
      const record = dbRecord as BaseRatePricingSchema;
      return {
        additionalPrice: record.additionalPrice,
        additionalTime: record.additionalTime,
        addons: JSON.parse(record.addons),
        basePrice: record.basePrice,
        baseTime: record.baseTime,
        timeUnit: record.timeUnit,
        type: 'baseRate',
      };
    }

    if (serviceType === 'tiered') {
      const record = dbRecord as TieredPricingSchema;
      return {
        tierMapping: JSON.parse(record.tierMapping),
        tiers: JSON.parse(record.tiers),
        type: 'tiered',
      };
    }

    throw new Error('Unknown service type');
  }
}

// Example usage and service factory
class ServiceFactory {
  static createWalkingService(id: string): ServiceConfig {
    return {
      description: 'Professional dog walking service',
      id,
      isBase: true,
      metadata: {
        maxDogs: 3,
        requiresKey: true,
      },
      name: 'Dog Walking',
      pricingModel: {
        additionalPrice: BASE_PRICES.walking.additionalPrice,
        additionalTime: BASE_PRICES.walking.additionalTime,
        addons: {
          extendedArea: 5,
          extraDog: 10,
          holidays: 15,
        },
        basePrice: BASE_PRICES.walking.basePrice,
        baseTime: BASE_PRICES.walking.baseTime,
        timeUnit: 'mins',
        type: 'baseRate',
      },
    };
  }

  static createSittingService(config: BaseRatePricing): ServiceConfig {
    return {
      description: 'Professional dog walking service',
      isBase: true,
      metadata: {
        maxDogs: 3,
        requiresKey: true,
      },
      name: 'Dog Walking',
      pricingModel: {
        additionalPrice: config.additionalPrice,
        additionalTime: config.additionalTime,
        addons: {
          extendedArea: 5,
          extraDog: 10,
          holidays: 15,
        },
        basePrice: config.basePrice,
        baseTime: config.baseTime,
        timeUnit: 'mins',
        type: 'baseRate',
      },
    };
  }

  static createBathingService(id: string): ServiceConfig {
    return {
      description: 'Professional dog bathing service',
      id,
      isBase: true,
      metadata: {
        includesTowels: true,
        requiresFacility: true,
      },
      name: 'Dog Bathing',
      pricingModel: {
        tierMapping: [
          { criteria: '0-15 lbs', description: 'Small (0-15 lbs)' },
          { criteria: '16-40 lbs', description: 'Medium (16-40 lbs)' },
          { criteria: '41-80 lbs', description: 'Large (41-80 lbs)' },
          { criteria: '80+ lbs', description: 'Extra Large (80+ lbs)' },
        ],
        tiers: {
          extraLarge: 65,
          large: 55,
          medium: 45,
          small: 35,
        },
        type: 'tiered',
      },
    };
  }
}

// Example price calculation
function calculateServicePrice(
  service: ServiceConfig,
  params: {
    duration?: number;
    tier?: string;
    addons?: string[];
  }
): number {
  if (isBaseRatePricing(service.pricingModel) && params.duration) {
    return PricingCalculator.calculateBaseRatePrice(
      service.pricingModel,
      params.duration,
      params.addons
    );
  }

  if (isTieredPricing(service.pricingModel) && params.tier) {
    return PricingCalculator.calculateTieredPrice(
      service.pricingModel,
      params.tier
    );
  }

  throw new Error('Invalid pricing calculation parameters');
}
