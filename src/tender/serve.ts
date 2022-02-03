import { IPFS } from '../ipfs';
import { runScriptOnRuntime } from '../runtime';

/**
 * Runs a given script file on IPFS, and returns the rendered content.
 * @param ipfs IPFS
 * @param cid The CID of the script file
 *
 * @throws [[ScriptSyntaxError]] if the script is not valid a TypeScript.
 * @throws [[PermissionError]] if the script tries to violate the sandboxing rules,
 *        such as attempt to read or write host file system.
 */
export async function serve(ipfs: IPFS, cid: string): Promise<string> {
  const scriptContent = await ipfs.read(cid);
  return await runScriptOnRuntime(scriptContent);
}
