export class CIDNotFound extends Error {
  status = 404;

  constructor(public cid: string) {
    super('CID not found on IPFS');
  }
}
