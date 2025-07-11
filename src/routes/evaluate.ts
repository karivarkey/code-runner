import { Elysia, t } from 'elysia';
import { runCppCode } from '../services/cppRunner';

export const evaluateRoute = new Elysia({ prefix: '/evaluate' })

  // 1. POST /evaluate
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
  })

  // 2. POST /evaluate/complexity
  .post('/complexity', async ({ body }) => {
  const { code, inputSets } = body;

  const results: { inputSize: number; timeTakenMs: number }[] = [];

  for (const input of inputSets) {
    const combinedInput = input.join('\n');
    const result = await runCppCode(code, combinedInput);
    results.push({
      inputSize: input.length,
      timeTakenMs: result.timeTakenMs,
    });
  }

  const averageTimeMs = results.reduce((sum, r) => sum + r.timeTakenMs, 0) / results.length;

  return {
    averageTimeMs,
    data: results
  };
}, {
  body: t.Object({
    code: t.String(),
    inputSets: t.Array(t.Array(t.String()))
  })
});

