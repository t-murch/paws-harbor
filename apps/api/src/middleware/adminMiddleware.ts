import { Context, Next } from 'hono';

export const adminMiddleware = async (context: Context, next: Next) => {
  const user = context.get('user');

  return next();
};
