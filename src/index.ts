import { Elysia } from 'elysia';
import { runRoute } from './routes/run';
import { evaluateRoute } from './routes/evaluate';

const app = new Elysia();

app.use(runRoute);
app.use(evaluateRoute);

app.listen(3000);
console.log('🧠 LeetCode Runner listening on http://localhost:3000');
