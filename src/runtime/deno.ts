import { exec, ExecException } from 'child_process';
import { promisify } from 'util';
import { PermissionError, ScriptSyntaxError } from './errors';

const execAsync = promisify(exec);

export interface DenoRunConfig {
  workingDirectory: string;
  timeout: number;
  allowedDomains: string[];
  allowedFilesToRead: string[];
  allowedFilesToWrite: string[];
}

export interface DenoRunOutput {
  stdout: string;
  stderr: string;
  elapsedMs: number;
}

/**
 * Runs a script with Deno runtime. The runtime is fully sandboxed and only allo
 */
export async function runScriptWithDeno(
  scriptPath: string,
  scriptInput: Record<string, unknown>,
  config: Partial<DenoRunConfig> = {},
): Promise<DenoRunOutput> {
  const startedAt = Date.now();

  const args: string[] = [];
  if (config.allowedFilesToRead?.length) {
    args.push(`--allow-read=${commaList(config.allowedFilesToRead)}`);
  }
  if (config.allowedFilesToWrite?.length) {
    args.push(`--allow-write=${commaList(config.allowedFilesToWrite)}`);
  }
  if (config.allowedDomains?.length) {
    args.push(`--allow-net=${commaList(config.allowedDomains)}`);
  }

  try {
    const cmd = `deno run ${args.join(' ')} ${scriptPath} '${JSON.stringify(scriptInput)}'`;
    const options = {
      cwd: config.workingDirectory,
      timeout: config.timeout,
    };
    const { stderr, stdout } = await execAsync(cmd, options);
    return {
      stderr,
      stdout,
      elapsedMs: Date.now() - startedAt,
    };
  } catch (err) {
    const { code, stderr } = err as (ExecException & { stderr?: string });
    if (code === 1 && typeof stderr === 'string') {
      if (stderr.includes('Uncaught PermissionDenied')) {
        throw new PermissionError(stderr);
      }
      if (stderr.includes('The module\'s source code could not be parsed')) {
        throw new ScriptSyntaxError(stderr);
      }
    }
    throw err;
  }
}

const commaList = (list?: string[]) => (list ?? []).join(',');
