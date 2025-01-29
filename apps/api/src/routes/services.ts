import { log } from '@repo/logger';
import { SelectServiceSchema, Service } from '@repo/shared/db/schemas/schema';
import {
  ServicePricingDetails,
  ServicePricingService,
} from '@repo/shared/types/servicePricing';
import { User } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { db, GeneralError, GeneralResponse } from '../db';
import { ServicePricingRepository } from '../db/queries/servicePricing';
import { ServiceRepository } from '../db/queries/services';

type Variables = {
  user: User;
};

const servicesRoute = new Hono<{ Variables: Variables }>();

const OfferingService = new ServiceRepository(db);
const NewOfferingService = new ServicePricingRepository(db);

servicesRoute.get('/all', async (context) => {
  log(`getAll called route called.`);
  // const allServices = await OfferingService.getAll();
  const allServices = await NewOfferingService.getAllServices();
  if (!allServices.success) {
    return context.json<GeneralResponse<ServicePricingDetails[], GeneralError>>(
      { error: { message: allServices.error.message }, success: false },
      400
    );
  }

  console.debug(`allServices = ${JSON.stringify(allServices.data)}`);
  return context.json<GeneralResponse<ServicePricingDetails[], GeneralError>>({
    data: allServices.data,
    success: true,
  });
});

servicesRoute.get('/:id', async (context) => {
  const id = context.req.param('id');
  const user = context.get('user');
  if (!user) {
    return context.json<GeneralResponse<ServicePricingDetails[], GeneralError>>(
      {
        error: { message: 'Unauthorized' },
        success: false,
      },
      401
    );
  }

  // const service2 = await OfferingService.findById(id);
  const service = await NewOfferingService.getServiceById(id);
  if (!service.success) {
    return context.json<GeneralResponse<ServicePricingDetails[], GeneralError>>(
      { error: { message: service.error.message }, success: false },
      500
    );
  }

  return context.json<GeneralResponse<ServicePricingDetails, GeneralError>>({
    data: service.data,
    success: true,
  });
});

servicesRoute.post(
  '/new',
  validator('json', (val, context) => {
    // const parsed = InsertServiceSchema.safeParse(val);
    const parsed = ServicePricingService.NewServicePricingSchema.safeParse(val);
    if (!parsed.success) {
      const errorMsg = `Service Validation Failure. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMsg);
      return context.json(
        <GeneralResponse<ServicePricingDetails, GeneralError>>{
          error: { message: errorMsg },
          success: false,
        },
        400
      );
    }

    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json<
        GeneralResponse<ServicePricingDetails['id'], GeneralError>
      >(
        {
          error: { message: 'Unauthorized' },
          success: false,
        },
        400
      );
    }
    const input = context.req.valid('json');

    // const newServiceId = await OfferingService.create(input);
    const createResponse = await NewOfferingService.create(input);
    if (!createResponse.success) {
      return context.json<
        GeneralResponse<ServicePricingDetails['id'], GeneralError>
      >(
        { error: { message: createResponse.error.message }, success: false },
        500
      );
    }
    return context.json<
      GeneralResponse<ServicePricingDetails['id'], GeneralError>
    >({
      data: createResponse.data,
      success: true,
    });
  }
);

servicesRoute.post(
  '/bulk',
  validator('json', (val, context) => {
    // const parsed = InsertServiceSchema.array().safeParse(val);
    const parsed =
      ServicePricingService.NewServicePricingSchema.array().safeParse(val);
    if (!parsed.success) {
      log(`val=${JSON.stringify(val, null, 2)}`);
      const errorMsg = `Service Validation Failure. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMsg);
      return context.json<
        GeneralResponse<ServicePricingDetails[], GeneralError>
      >({ error: { message: errorMsg }, success: false });
    }

    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json<
        GeneralResponse<ServicePricingDetails[], GeneralError>
      >({
        error: { message: 'Unauthorized' },
        success: false,
      });
    }
    const input = context.req.valid('json');

    // const newServices = await OfferingService.bulkUpdate(input);
    const newServices = await NewOfferingService.bulkUpdate(input);
    if (!newServices.success) {
      return context.json<
        GeneralResponse<ServicePricingDetails[], GeneralError>
      >({ error: { message: newServices.error.message }, success: false });
    }

    return context.json<GeneralResponse<ServicePricingDetails[], GeneralError>>(
      {
        data: newServices.data,
        success: true,
      }
    );
  }
);

servicesRoute.put(
  '/:id',
  validator('json', (val, context) => {
    const parsed = SelectServiceSchema.safeParse(val);
    if (!parsed.success) {
      const errorMsg = `Service Validation Failure. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMsg);
      return context.json<GeneralResponse<Service, GeneralError>>({
        error: { message: errorMsg },
        success: false,
      });
    }

    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json<GeneralResponse<Service, GeneralError>>({
        error: { message: 'Unauthorized' },
        success: false,
      });
    }
    const input = context.req.valid('json');

    const serviceId = await OfferingService.update(input.id, input);
    return context.json<GeneralResponse<Service, GeneralError>>({
      data: serviceId,
      success: true,
    });
  }
);

export default servicesRoute;
