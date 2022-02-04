import Koa from 'koa';
import cors from '@koa/cors';
import json from 'koa-json';
import logger from 'koa-logger';
import bodyParser from 'koa-body';
import { Config } from '../config';
import { errorHandler } from './error-handler';
import { createRoutes } from './routes';

export function createServer(config: Config): Koa {
  const app = new Koa();
  app.use(json());
  app.use(cors());
  app.use(logger());
  app.use(bodyParser({ multipart: true }));
  app.use(errorHandler());
  app.use(createRoutes(config))
  return app;
}
