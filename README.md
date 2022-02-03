# Tender

> Layer 2 for IPFS / API Renderer for Web3 / Serverless for Ethereum


Tender is dynamic content serving P2P Protocol for Ethereum.


## V1 Design

 * A Code is hosted on IPFS
 * The code runs on [Deno](https://deno.land/)
   * **The runtime is sandboxed and stateless**: Any side effects or state mutations are prohibited
 * You can only query Ethereum, using as a state repository
 * You can render responses as any format

```ts
import { render, web3 } from 'https://tender.dev/lib/mod.ts';

const uniToken = web3.eth.Contract(
  ethereum.abis.ERC20,
  'uni.uniswap.eth',
);

render({
  block: await web3.eth.getBlockNumber(),
  balance: await uniToken.balanceOf('hyojun.eth'),
});
```

After deploying the code on IPFS, you can render it with servin:
```
curl -XGET https://servin.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR
```

```
HTTP/1.1 200 OK
{
  "block": 42424113,
  "balance": "1000000.0000"
}
```
