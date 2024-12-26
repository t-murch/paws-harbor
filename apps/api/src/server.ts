import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import userRoute from './routes/users';
import { authMiddleware } from './middleware/authMiddleware';
import { User } from '@supabase/supabase-js';
import { showRoutes } from 'hono/dev';
import { prettyJSON } from 'hono/pretty-json';
import petsRoute from './routes/pets';
import servicesRoute from './routes/services';
import { adminMiddleware } from './middleware/adminMiddleware';
import availabilityRoute from './routes/availability';

type Variables = {
  user: User;
};

const app = new Hono<{ Variables: Variables }>();

app
  .use('*', logger())
  .use('*', secureHeaders()) // Disable "x-powered-by"
  .use(
    '*',
    cors({
      allowHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // Allow cookies and credentials
      origin: 'https://localhost:3000', // Replace with your client origin
    })
  )
  .use('users/*', authMiddleware)
  .use('pets/*', authMiddleware)
  // TODO: implement admin middleware
  .post('admin/services/*', ...[authMiddleware, adminMiddleware])
  .put('admin/services/*', ...[authMiddleware, adminMiddleware])
  .delete('admin/services/*', ...[authMiddleware, adminMiddleware])
  .use('admin/availability/*', ...[authMiddleware, adminMiddleware])
  .use(prettyJSON());

app.route('/users', userRoute);
app.route('/pets', petsRoute);
app.route('/admin/services', servicesRoute);
app.route('/admin/availability', availabilityRoute);
app.route('/availability', availabilityRoute);

app.get('/message/:name', (c) => {
  return c.json({ message: `hello ${c.req.param('name')}` });
});

app.get('/status', (c) => {
  return c.json({ ok: true });
});

// if (process.env.NODE_ENV === "dev") {
showRoutes(app, {
  verbose: true,
});
// }

export default app;
