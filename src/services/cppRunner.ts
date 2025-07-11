export const runCppCode = async (code: string, input: string): Promise<{ output: string; timeTakenMs: number }> => {
  // This will be replaced with actual Docker runner
  return {
    output: `STUB OUTPUT for input: ${input}`,
    timeTakenMs: Math.floor(Math.random() * 100),
  };
};
