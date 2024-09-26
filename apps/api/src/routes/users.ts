import UserService, { loginFormSchema } from "@/db/queries/users";
import { profileSchema, SelectProfile } from "@/db/users";
import { log } from "@repo/logger";
import {
  AuthResponse,
  AuthResponsePassword,
  EmailOtpType,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import { Hono } from "hono";
import { validator } from "hono/validator";

type Variables = {
  user: User;
};

const userRoute = new Hono<{ Variables: Variables }>()
  .post(
    "/users/signup",
    validator("json", (value, context) => {
      const parsed = loginFormSchema.safeParse(value);
      if (!parsed.success) {
        log(
          `Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`,
        );
        return context.json({ message: "Signup validation failure.. " });
      }

      return parsed.data;
    }),
    async (c) => {
      const user = c.req.valid("json");
      if (!user) return c.json({ error: "invalid data" });

      const authResponse = await UserService.createUser(c, user);
      if (authResponse.error) {
        log(`Signup Error: ${authResponse.error}`);
        return c.json({ error: authResponse.error }, 400);
      }

      return c.json(authResponse.data);
    },
  )
  .get("/auth/confirm", async (c) => {
    const token_hash = c.req.query("token_hash"),
      type = c.req.query("type") as EmailOtpType,
      next = c.req.query("next") ?? "/";

    if (!token_hash || !type) {
      log(`Missing required token_hash || type params`);
      return c.json(
        { error: `Missing required token_hash || type params` },
        400,
      );
    }
    let response: AuthResponse;
    response = await UserService.verifyEmail(c, { token_hash, type });

    if (response.error) {
      log(`Verification of email error: ${response.error}`);
      return c.redirect(`/`, 303);
    }

    log(`next urls=${next}`);
    c.redirect(`${next.slice(1)}`, 303);
  })
  .post(
    "/users/login",
    validator("json", (value, context) => {
      const parsed = loginFormSchema.safeParse(value);
      if (!parsed.success) {
        log(
          `Validation failed. Errors: ${JSON.stringify({ ...parsed.error.issues })}`,
        );
        return context.json({ message: "Login validation failure.. " });
      }

      return parsed.data;
    }),
    async (c) => {
      const user = c.req.valid("json");
      if (!user) {
        return c.json({ error: "Invalid login credentials" }, 400);
      }

      const authResponse: AuthResponsePassword = await UserService.loginUser(
        c,
        user,
      );
      if (authResponse.error) {
        log(`Login Error: ${authResponse.error}`);
        return c.json({ error: authResponse.error }, 400);
      }

      // If successful, set the HTTP-only cookie with the access token
      return c.json({
        session: authResponse.data.session,
        user: authResponse.data.user,
      });
    },
  )
  .get("/users/profile", async (c) => {
    const authUser = c.get("user");
    if (!authUser.email) {
      const message = `GetProfile error. Email required.`;
      log(message);
      return c.json({ error: message }, 400);
    }

    const myUser = await UserService.getUserByEmail(authUser.email);
    if (!myUser) return c.json({ error: "User not found" }, 404);

    return c.json({ data: { user: myUser }, error: null });
  })
  .post(
    "/users/profile",
    validator("json", (value, context) => {
      const parsed = profileSchema.safeParse(value);
      if (!parsed.success) {
        log(`Validation failed`);
        log(`Errors: ${JSON.stringify({ ...parsed.error.issues })}`);
        return context.json({ message: "UpdateProfile failure.. " });
      }
      return parsed.data;
    }),
    async (c) => {
      const userInput = c.req.valid("json");
      const userProfile: SelectProfile = {
        ...userInput,
        createdAt: new Date(userInput.createdAt),
        updatedAt: new Date(Date.now()),
      };
      const authUser = c.get("user");
      let authResponse: UserResponse | null = null;

      if (authUser.email !== userProfile.email) {
        authResponse = { ...(await UserService.updateUser(c, userProfile)) };
      }

      if (authResponse && authResponse?.error) {
        const authErrorMessage = `Error updating auth user. User: ${userInput.id}, Error: ${authResponse.error.message}`;
        log(authErrorMessage);
        return c.json({ data: null, error: authErrorMessage });
      }

      const profileResponse = await UserService.updateProfile(userProfile);

      return c.json({ data: profileResponse, error: null });
    },
  );

export default userRoute;
