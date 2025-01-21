import { db } from '@/db';
import { AvailabilityRepository } from '@/db/queries/availability';
import { log } from '@repo/logger';
import { requestServiceAvailabilitySchema } from '@repo/shared/src/db/schemas/availability';
import { User } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { validator } from 'hono/validator';

type Variables = {
  user: User;
};

const AvailabilityService = new AvailabilityRepository(db);

const availabilityRoute = new Hono<{ Variables: Variables }>();

availabilityRoute.post(
  '/service',
  validator('json', (val, context) => {
    const parsed = requestServiceAvailabilitySchema.safeParse(val);
    // const parsed = insertServiceAvailabilitySchema.omit({ adminId: true }).safeParse(val);

    if (!parsed.success) {
      const errorMessage = `Create Availability Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`;
      log(errorMessage);
      return context.json({ message: errorMessage }, 400);
    }
    return parsed.data;
  }),
  async (context) => {
    const user = context.get('user');
    if (!user) {
      return context.json(
        {
          data: null,
          error: { message: 'Unauthorized' },
        },
        401
      );
    }

    const data = context.req.valid('json');
    log(`user @ route=${JSON.stringify(user)}`);
    const availability = AvailabilityService.requestTypetoInsertType(
      user.id,
      data
    );

    log(`availability @ route=${JSON.stringify(availability)}`);

    const res = await AvailabilityService.createAvailability(availability);
    if (!res.success) {
      return context.json({ data: null, success: false }, 500);
    }

    return context.json({ data: res.data, success: true }, 201);
  }
);

availabilityRoute.get('/service/all', async (context) => {
  const query = context.req.query('days');
  const param: number | undefined = query ? parseInt(query) : undefined;
  return context.json(await AvailabilityService.getAllAvailability(param));
});

export default availabilityRoute;
