import { Elysia } from 'elysia';
import { runRoute } from './routes/run';
import { evaluateRoute } from './routes/evaluate';

const app = new Elysia();

app.use(runRoute);
app.use(evaluateRoute);

app.listen({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  hostname: '0.0.0.0'
});

console.log('🧠 LeetCode Runner listening on http://localhost:3000');
