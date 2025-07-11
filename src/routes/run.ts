import { Elysia, t } from 'elysia';
import { runCppCode } from '../services/cppRunner';

export const runRoute = new Elysia({ prefix: '/run' })
  .post('/', async ({ body, headers }) => {
    const code = body?.code || '';
    const input = headers?.['stdin'] || '';

    if (!code) return { error: 'Code is required' };

    const result = await runCppCode(code, input);
    return result;
  }, {
    body: t.Object({ code: t.String() }),
  });
