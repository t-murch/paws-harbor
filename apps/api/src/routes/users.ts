import UserService, {
  emailSchema,
  loginFormSchema,
  VerifyResponse,
} from "@/db/queries/users";
import { zValidator } from "@hono/zod-validator";
import { log } from "@repo/logger";
import { EmailOtpType } from "@supabase/supabase-js";
import { Hono } from "hono";

const userRoute = new Hono();

userRoute.post(
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

userRoute.get("/auth/confirm", async (c) => {
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

userRoute.post(
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

userRoute.post(
  "/users/logout",
  zValidator("json", emailSchema, (result, context) => {
    if (!result.success) {
      return context.json({ message: "Invalid email" }, 400);
    }
  }),
  async (c) => {
    const { email } = c.req.valid("json");
    if (!email) {
      return c.json({ error: "Missing email for signout" }, 400);
    }

    const authResponse = await UserService.logoutUser({ email });
    if (authResponse.error) {
      log(`Login Error: ${authResponse.error}`);
      return c.json({ error: authResponse.error }, 400);
    }

    return c.json(authResponse.data);
  },
);

export default userRoute;
