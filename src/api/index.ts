import Koa from 'koa';
import cors from '@koa/cors';
import json from 'koa-json';
import logger from 'koa-logger';
import bodyParser from 'koa-body';
import Router from 'koa-router';
import { Config } from '../config';
import { IPFS } from '../ipfs';
import { deploy, DeployResult, serve } from '../tender';
import { errorHandler } from './error-handler';
import { File } from 'formidable';

export function createServer(config: Config): Koa {
  const app = new Koa();
  app.use(json());
  app.use(cors());
  app.use(logger());
  app.use(bodyParser({ multipart: true }));
  app.use(errorHandler());

  const router = new Router();
  router.get('/', async (ctx) => {
    ctx.body = { message: 'all systems golang' };
  });

  const ipfs = new IPFS(config.pinataApiKey, config.pinataApiSecret);
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
  app.use(router.middleware());
  return app;
}
