import { IPFS } from '../ipfs';
import { validateScriptForRuntime } from '../runtime';

export type DeployErrorCodes = 'VALIDATION_FAILED';

export interface DeployResult {
  result?: {
    cid: string;
    url: string;
  };
  error?: {
    code: DeployErrorCodes;
    detail: string;
  };
}

/**
 * Uploads given script file to IPFS.
 */
export async function deploy(ipfs: IPFS, localFile: string): Promise<DeployResult> {
  const { ok, errorsFound } = await validateScriptForRuntime(localFile);
  if (!ok && errorsFound) {
    return {
      error: {
        code: 'VALIDATION_FAILED',
        detail: errorsFound,
      },
    };
  }
  const cid = await ipfs.write(localFile);
  return {
    result: {
      cid,
      url: ipfs.urlOf(cid),
    },
  };
}
