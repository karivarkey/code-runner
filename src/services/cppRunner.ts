import { writeFileSync, unlinkSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';

export const runCppCode = async (
  code: string,
  input: string
): Promise<{ output: string; timeTakenMs: number }> => {
  const id = randomUUID();
  const codePath = path.join('/tmp', `${id}.cpp`);
  const inputPath = path.join('/tmp', `${id}.in`);
  const binPath = path.join('/tmp', `${id}.out`);

  try {
    // Step 1: Write source and input files
    writeFileSync(codePath, code);
    writeFileSync(inputPath, input);
    if (/system\s*\(/.test(code)) {
  return {
    output: "Blocked: usage of system() is not allowed.",
    timeTakenMs: 0
  };
}

    // Step 2: Compile code
    const compileStart = Date.now();
    execSync(`g++ ${codePath} -o ${binPath} -O2`);
    const compileEnd = Date.now();

    // Step 3: Run binary with ULIMITS
    const runStart = Date.now();

    const run = spawnSync('/bin/bash', ['-c', `
      ulimit -v 262144  # 256MB memory
      ulimit -t 2       # Max 2 seconds CPU time
      ulimit -f 1024    # Max output file size = 1MB
      exec "${binPath}"
    `], {
      input,
      encoding: 'utf-8',
      timeout: 3000, // Wall-clock timeout in ms
      shell: true
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
    // Cleanup
    try {
      unlinkSync(codePath);
      unlinkSync(inputPath);
      unlinkSync(binPath);
    } catch (_) {}
  }
};
