import OfferingService from '@/db/queries/services';
import { InsertServiceSchema, ServiceSchema } from '@/db/services';
import { log } from '@repo/logger';
import { User } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { validator } from 'hono/validator';

type Variables = {
  user: User;
};

const servicesRoute = new Hono<{ Variables: Variables }>();

servicesRoute.get('/all', async (context) => {
  const user = context.get('user');
  if (!user) {
    return context.json({
      data: null,
      error: { message: 'Unauthorized' },
    });
  }
  const allServices = await OfferingService.getAllServices();

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

  const service = await OfferingService.getService(id);

  return context.json({ data: service[0] ?? null, success: true });
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

    const newServiceId = await OfferingService.createService(input);
    return context.json({ data: newServiceId, success: true });
  }
);

servicesRoute.put(
  '/:id',
  validator('json', (val, context) => {
    const parsed = ServiceSchema.safeParse(val);
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

    const serviceId = await OfferingService.updateService(input);
    return context.json({ data: serviceId, success: true });
  }
);

export default servicesRoute;
