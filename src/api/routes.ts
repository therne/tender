import { Config } from '../config';
import { IPFS } from '../ipfs';
import { deploy, DeployResult, serve } from '../tender';
import { File } from 'formidable';
import Router, { IMiddleware } from 'koa-router';

export function createRoutes(config: Config): IMiddleware {
  const ipfs = new IPFS(config.pinataApiKey, config.pinataApiSecret);

  const router = new Router();

  router.get('/', async (ctx) => {
    ctx.body = { message: 'all systems golang' };
  });

  router.get('/ipfs/:cid', async (ctx) => {
    const { cid } = ctx.params;
    ctx.body = await serve(ipfs, cid);
  });

  router.post('/deploy', async (ctx) => {
    const fileEntries = Object.entries(ctx.request.files ?? {});
    if (fileEntries.length === 0) {
      ctx.body = { error: { code: 'NO_UPLOADS', details: 'no files provided' } };
      ctx.status = 400;
      return;
    }
    const deployed: { name: string, result: DeployResult }[] = [];
    for (const [name, file] of fileEntries) {
      const { path } = file as File;
      const result = await deploy(ipfs, path);
      deployed.push({ name, result });
    }
    ctx.body = { deployed };
  });

  return router.middleware();
}
