import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import userRoute from "./routes/users";

const app = new Hono();

app
  .use("*", secureHeaders()) // Disable "x-powered-by"
  .use("*", logger())
  .use("*", cors());

app.route("/", userRoute);

app.get("/message/:name", (c) => {
  return c.json({ message: `hello ${c.req.param("name")}` });
});

app.get("/status", (c) => {
  return c.json({ ok: true });
});

export default app;
