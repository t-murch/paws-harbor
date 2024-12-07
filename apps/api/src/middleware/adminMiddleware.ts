import { Context, Next } from 'hono';

// TODO: implement admin middleware
export const adminMiddleware = async (context: Context, next: Next) => {
  const user = context.get('user');

  return next();
};
