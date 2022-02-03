import { mkdtemp, readFile, writeFile, stat, access } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { DenoRunConfig, runScriptWithDeno } from './deno';

const SCRIPT_NAME = 'script.ts';
const RENDERED_OUTPUT_NAME = 'rendered_output';
const TEMP_PREFIX = join(tmpdir(), 'tender');

/**
 * Runs a given TypeScript code on sandboxed runtime.
 *
 * @param scriptContent TypeScript content which will be run
 */
export async function runScriptOnRuntime(scriptContent: string): Promise<string> {
  const workingDirectory = await mkdtemp(TEMP_PREFIX);
  const scriptPath = join(workingDirectory, SCRIPT_NAME);
  const outputPath = join(workingDirectory, RENDERED_OUTPUT_NAME);

  await writeFile(scriptPath, scriptContent);

  const input = {};
  const config: Partial<DenoRunConfig> = {
    workingDirectory,
    allowedDomains: [],
    allowedFilesToRead: [],
    allowedFilesToWrite: [RENDERED_OUTPUT_NAME],
  };
  const { stdout, stderr, elapsedMs } = await runScriptWithDeno(scriptPath, input, config);
  console.log(`Run ${scriptPath}:\n  stdout: ${stdout}\n  stderr: ${stderr}\n  elapsed ${(elapsedMs / 1000).toFixed(2)}s`);

  // rendered contents are written on outputPath
  const outputExists = await checkExists(outputPath);
  if (!outputExists) {
    throw new Error('no outputs produced');
  }
  const output = await readFile(outputPath);
  return output.toString('utf-8');
}

const checkExists = (path: string): Promise<boolean> =>
  access(path)
    .then(() => true)
    .catch(() => false);
