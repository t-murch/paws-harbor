// const { zValidator } = await import("@hono/zod-validator");
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import UserService, {
  loginFormSchema,
  VerifyResponse,
} from "./db/queries/users";
import { log } from "@repo/logger";
import { EmailOtpType } from "@supabase/supabase-js";
import { error } from "console";

// export const createServer = () => {
const app = new Hono();

app
  .use("*", secureHeaders()) // Disable "x-powered-by"
  .use("*", logger())
  .use("*", cors());

app.get("/message/:name", (c) => {
  return c.json({ message: `hello ${c.req.param("name")}` });
});

app.get("/status", (c) => {
  return c.json({ ok: true });
});

app.post(
  "/users/signup",
  zValidator("json", loginFormSchema, (result, context) => {
    if (!result.success) {
      return context.json({ message: "Invalid credentials" }, 400);
    }
  }),
  async (c) => {
    const user = c.req.valid("json");
    if (!user) return c.json({ error: "invalid data" });

    const authResponse = await UserService.createUser(user);
    if (authResponse.error) {
      log(`Signup Error: ${authResponse.error}`);
      return c.json({ error: authResponse.error }, 400);
    }

    return c.json(authResponse.data);
  },
);

app.get("/auth/confirm", async (c) => {
  const { next, token_hash } = c.req.query();
  const type = c.req.query("type") as EmailOtpType;

  if (!token_hash || !type) {
    log(`Missing required token_hash || type params`);
    return c.json({ error: `Missing required token_hash || type params` }, 400);
  }
  let response: VerifyResponse;
  response = await UserService.verifyEmail({ token_hash, type });

  if (response.error) {
    log(`Verification of email error: ${response.error}`);
    return c.json(response, 400);
  }

  c.redirect(next);
});

app.post(
  "/users/login",
  zValidator("json", loginFormSchema, (result, context) => {
    if (!result.success) {
      return context.json({ message: "Invalid credentials" }, 400);
    }
  }),
  async (c) => {
    const user = c.req.valid("json");
    if (!user) {
      return c.json({ error: "Invalid login credentials" }, 400);
    }
    const authResponse = await UserService.loginUser(user);
    if (authResponse.error) {
      log(`Login Error: ${authResponse.error}`);
      return c.json({ error: authResponse.error }, 400);
    }

    return c.json(authResponse.data);
  },
);

export default app;
