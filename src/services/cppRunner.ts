import { writeFileSync, unlinkSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';

export const runCppCode = async (code: string, input: string): Promise<{ output: string; timeTakenMs: number }> => {
  const id = randomUUID();
  const codePath = path.join('/tmp', `${id}.cpp`);
  const inputPath = path.join('/tmp', `${id}.in`);
  const binPath = path.join('/tmp', `${id}.out`);

  try {
    // Step 1: Write files
    writeFileSync(codePath, code);
    writeFileSync(inputPath, input);

    // Step 2: Compile C++ code
    const compileStart = Date.now();
    execSync(`g++ ${codePath} -o ${binPath} -O2`);
    const compileEnd = Date.now();

    // Step 3: Run with input
    const runStart = Date.now();
    const run = spawnSync(binPath, {
      input,
      encoding: 'utf-8',
      timeout: 2000, // 2 second cap
    });
    const runEnd = Date.now();

    if (run.error) throw run.error;
    if (run.status !== 0) throw new Error(run.stderr || 'Runtime error');

    return {
      output: run.stdout.trim(),
      timeTakenMs: runEnd - runStart,
    };
  } catch (err: any) {
    return {
      output: `Error: ${err.message || err}`,
      timeTakenMs: 0,
    };
  } finally {
    // Step 4: Clean up
    try {
      unlinkSync(codePath);
      unlinkSync(inputPath);
      unlinkSync(binPath);
    } catch (_) {}
  }
};
