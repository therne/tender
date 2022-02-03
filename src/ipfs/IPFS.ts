import pinataClient, { PinataClient } from '@pinata/sdk';
import { basename } from 'path';
import fetch from 'node-fetch';

// uses pinata cloud as a gateway
const IPFS_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs';

/**
 * Provides an interface to interact with IPFS.
 * https://ipfs.io/
 */
export class IPFS {
  private readonly pinata: PinataClient;

  constructor(pinataApiKey: string, pinataApiSecret: string) {
    this.pinata = pinataClient(pinataApiKey, pinataApiSecret);
  }

  /**
   * Resolves the public-accessible URL of given CID (IPFS Content ID).
   */
  urlOf = (cid: string): string => `${IPFS_GATEWAY_URL}/${cid}`;

  /**
   * Reads a IPFS content corresponding with given CID.
   * @param cid IPFS Content ID (CID)
   */
  async read(cid: string): Promise<string> {
    const response = await fetch(this.urlOf(cid));
    return response.text();
  }

  /**
   * Pins a local file to IPFS.
   *
   * @param filePath A local file path
   * @returns the CID of pinned file.
   */
  async write(filePath: string): Promise<string> {
    const name = `tender-${basename(filePath)}`;
    const { IpfsHash: cid } = await this.pinata.pinFromFS(filePath, { pinataMetadata: { name } });
    return cid;
  }
}
