import { Middleware } from 'koa';
import { PermissionError, ScriptSyntaxError } from '../runtime/errors';
import { CIDNotFound } from '../ipfs';

const KNOWN_ERRORS = [
  {
    type: ScriptSyntaxError,
    mapper: (err: unknown) => ({
      code: 'SYNTAX_ERROR',
      details: (err as ScriptSyntaxError).originalOutput,
    }),
  },
  {
    type: PermissionError,
    mapper: (err: unknown) => ({
      code: 'PERMISSION_ERROR',
      details: (err as PermissionError).originalOutput,
    }),
  },
  {
    type: CIDNotFound,
    mapper: (err: unknown) => ({
      code: 'NOT_FOUND',
      details: `${(err as CIDNotFound).cid} not found on IPFS`,
    }),
  }
];

export function errorHandler(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) {
        ctx.body = { error: { message: 'not found' } };
        ctx.status = 404;
      }
    } catch (err) {
      const status = (err as { status?: number }).status ?? 500;

      for (const { type, mapper } of KNOWN_ERRORS) {
        if (err instanceof type) {
          ctx.body = { error: mapper(err) };
          ctx.status = status;
          return;
        }
      }
      ctx.body = {
        error: {
          code: 'INTERNAL_ERROR',
          details: (err as Error).stack,
        },
      };
      ctx.status = status;
    }
  };
}
