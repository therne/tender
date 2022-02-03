import Koa from 'koa';
import cors from '@koa/cors';
import json from 'koa-json';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { Config } from '../config';

export function createServer(config: Config): Koa {
  const app = new Koa();
  app.use(json());
  app.use(cors());
  app.use(logger());
  app.use(bodyParser());

  const router = new Router();
  router.get('/', async (ctx) => {
    ctx.body = { message: 'all systems golang' };
  });
  app.use(router.middleware());
  return app;
}
