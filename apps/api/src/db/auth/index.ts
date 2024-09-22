import { log } from "@repo/logger";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export const authClient = (context: Context) => {
  const DATABASE_URL = process.env.AUTH_URL!;
  return createServerClient(DATABASE_URL, process.env.AUTH_SERVICE_KEY!, {
    cookies: {
      getAll() {
        const cookieStore = getCookie(context);
        // log(`get cookieStore=${JSON.stringify(cookieStore)}`);
        return parseCookieHeader(JSON.stringify(cookieStore) ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // log(`set cookieStore=${JSON.stringify({ name, value, options })}`);
          setCookie(context, name, value, options);
          // context.res.headers.append(
          //   name,
          //   serializeCookieHeader(name, value, options),
          // );
          // log(`cookieOptions=${JSON.stringify(getCookie(context))}`);
        });
      },
    },
  });
};
