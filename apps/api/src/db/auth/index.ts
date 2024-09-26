import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export const authClient = (context: Context) => {
  const DATABASE_URL = process.env.AUTH_URL!;
  return createServerClient(DATABASE_URL, process.env.AUTH_SERVICE_KEY!, {
    cookies: {
      getAll() {
        const cookieStore = getCookie(context);
        return parseCookieHeader(JSON.stringify(cookieStore) ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(context, name, value, options);
        });
      },
    },
  });
};
