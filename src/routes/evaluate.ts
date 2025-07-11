import { Elysia, t } from 'elysia';
import { runCppCode } from '../services/cppRunner';

export const evaluateRoute = new Elysia({ prefix: '/evaluate' })
  .post('/', async ({ body }) => {
    const { code, inputs, expected } = body;

    const results = await Promise.all(inputs.map(async (input, i) => {
      const result = await runCppCode(code, input);
      return {
        input,
        expected: expected[i],
        output: result.output,
        passed: result.output.trim() === expected[i].trim(),
        time: result.timeTakenMs,
      };
    }));

    return results;
  }, {
    body: t.Object({
      code: t.String(),
      inputs: t.Array(t.String()),
      expected: t.Array(t.String())
    }),
  });
