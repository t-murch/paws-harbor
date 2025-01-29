import { log } from '@repo/logger';
import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { authClient } from '../db/auth';

export const authMiddleware = async (context: Context, next: Next) => {
  const projectId = process.env.SB_AUTH_URL!;
  const authorizationHeader = context.req
    .header('Authorization')
    ?.replace('Bearer base64-', '');
  const authorizationCookie = getCookie(
    context,
    `sb-${projectId}-auth-token`
  )?.replace('base64-', '');
  const authHeader = authorizationHeader ?? authorizationCookie;

  if (!authHeader) {
    log(`I'm rejecting here :( : no auth header`);
    log(`authHeaders=${JSON.stringify(authorizationHeader)}`);
    return context.json({ error: 'Unauthorized' }, 401);
  }
  const base64JWT = Buffer.from(authHeader, 'base64').toString('utf8');
  const jwtObject = JSON.parse(base64JWT);

  const { data } = await authClient(context).auth.getUser(
    jwtObject?.access_token
  );

  if (!data?.user) {
    const errorMsg = `Unauthorized. User not found.`;
    log(errorMsg);
    return context.json({ error: errorMsg }, 401);
  }

  context.set('user', data.user);
  return next();
};
