import { db } from '@/db';
import { ServiceRepository } from '@/db/queries/services';
import { log } from '@repo/logger';
import {
  InsertServiceSchema,
  SelectServiceSchema,
} from '@repo/shared/src/db/schemas/services';
import { User } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { validator } from 'hono/validator';

type Variables = {
  user: User;
};

const servicesRoute = new Hono<{ Variables: Variables }>();

const OfferingService = new ServiceRepository(db);

servicesRoute.get('/all', async (context) => {
  log(`getAll called route called.`);
  const allServices = await OfferingService.getAll();

  return context.json({ data: allServices, success: true });
});

servicesRoute.get('/:id', async (context) => {
  const id = context.req.param('id');
  const user = context.get('user');
  if (!user) {
    return context.json({
      data: null,
      error: { message: 'Unauthorized' },
    });
  }

  const service = await OfferingService.findById(id);

  return context.json({ data: service ?? null, success: true });
});

servicesRoute.post(
  '/new',
  validator('json', (val, context) => {
    const parsed = InsertServiceSchema.safeParse(val);
    if (!parsed.success) {
      const errorMsg = `Service Validation Failure. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMsg);
      return context.json({ error: { message: errorMsg } });
    }

    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json({
        data: null,
        error: { message: 'Unauthorized' },
      });
    }
    const input = context.req.valid('json');

    const newServiceId = await OfferingService.create(input);
    return context.json({ data: newServiceId, success: true });
  }
);

servicesRoute.post(
  '/bulk',
  validator('json', (val, context) => {
    const parsed = InsertServiceSchema.array().safeParse(val);
    if (!parsed.success) {
      const errorMsg = `Service Validation Failure. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMsg);
      return context.json({ error: { message: errorMsg } });
    }

    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json({
        data: null,
        error: { message: 'Unauthorized' },
      });
    }
    const input = context.req.valid('json');

    const newServiceId = await OfferingService.bulkUpdate(input);
    return context.json({ data: newServiceId, success: true });
  }
);

servicesRoute.put(
  '/:id',
  validator('json', (val, context) => {
    const parsed = SelectServiceSchema.safeParse(val);
    if (!parsed.success) {
      const errorMsg = `Service Validation Failure. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMsg);
      return context.json({ error: { message: errorMsg } });
    }

    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json({
        data: null,
        error: { message: 'Unauthorized' },
      });
    }
    const input = context.req.valid('json');

    const serviceId = await OfferingService.update(input.id, input);
    return context.json({ data: serviceId, success: true });
  }
);

export default servicesRoute;
