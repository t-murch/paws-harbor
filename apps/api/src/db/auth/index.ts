import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';

export const authClient = (context: Context) => {
  const DATABASE_URL = isProd
      ? process.env.AUTH_URL!
      : process.env.LOCAL_AUTH_URL!,
    AUTH_SERVICE_KEY = isProd
      ? process.env.AUTH_SERVICE_KEY!
      : process.env.LOCAL_AUTH_SERVICE_KEY!;

  return createServerClient(DATABASE_URL, AUTH_SERVICE_KEY, {
    cookies: {
      getAll() {
        const cookieStore = getCookie(context);
        return parseCookieHeader(JSON.stringify(cookieStore) ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(context, name, value, options);
        });
      },
    },
  });
};

const isProd = process.env.NODE_ENV === 'production';
