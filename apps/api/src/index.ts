import { serve } from "@hono/node-server";
import app from "./server";
import { allUsers } from "./db";

// const app = createServer();
const port = process.env.PORT || 3001;

// serve({ fetch: app.fetch, port: +port || 3001 });
serve({ fetch: app.fetch, port: +port || 3001 });

console.log(`allUsers: ${JSON.stringify(allUsers)}`);
console.log(`listening on: ${+port || 3001}`);
