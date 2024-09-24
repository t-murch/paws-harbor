import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import userRoute from "./routes/users";
import { authMiddleware } from "./middleware/authMiddleware";
import { User } from "@supabase/supabase-js";
import { showRoutes } from "hono/dev";
import { prettyJSON } from "hono/pretty-json";
import petsRoute from "./routes/pets";

type Variables = {
  user: User;
};

const app = new Hono<{ Variables: Variables }>();

app
  .use("*", logger())
  .use("*", secureHeaders()) // Disable "x-powered-by"
  .use(
    "*",
    cors({
      origin: "https://localhost:3000", // Replace with your client origin
      allowMethods: ["GET", "POST", "PUT", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
      credentials: true, // Allow cookies and credentials
    }),
  )
  .use("/users/*", authMiddleware)
  .use("/pets/user", authMiddleware)
  .use(prettyJSON());

app.route("/", userRoute);
app.route("/", petsRoute);

app.get("/message/:name", (c) => {
  return c.json({ message: `hello ${c.req.param("name")}` });
});

app.get("/status", (c) => {
  return c.json({ ok: true });
});

// if (process.env.NODE_ENV === "dev") {
showRoutes(app, {
  verbose: true,
});
// }

export default app;
