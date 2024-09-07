// const { zValidator } = await import("@hono/zod-validator");
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import z from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8).max(32),
});

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
  "/users/login",
  zValidator("json", loginFormSchema, (result, context) => {
    if (!result.success) {
      return context.json({ message: "Invalid credentials" }, 400);
    }
  }),
  async (c) => {
    const user = c.req.valid("json");
    if (!user) {
      return c.json({ error: "invalid data" }, 400);
    }
    const { email, password } = user;
    // const body = await c.req.parseBody(); // Assuming user and pass are passed in the body
    console.log(`incoming /users/login body = ${JSON.stringify(user)}`);

    // TODO: add session logic
    // const session = await c.req.session.regenerate();
    // session.set("user", user);
    // await session.save();
    // return c.redirect("/");

    return c.json({ error: "Invalid login credentials" }, 400);
  },
);

// return app;
// };

export default app;
