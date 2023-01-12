/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
import { Logger as PinoLogger } from 'pino';
import { Response, NextFunction } from 'express';

import { ValidationError } from 'joi';

import { Logger } from '../../../libraries/logger';

import { ClientError } from '../../../libraries/errors/client';
import { ServerError } from '../../../libraries/errors/server';

import { Request } from '../interfaces';

import { ErrorResponse } from '../routers/interfaces';

import { ErrorMiddlewareHandler } from './interface';
import { HttpStatusCodes } from '../../../libraries/constants/http-status-codes';

export class ErrorMiddleware implements ErrorMiddlewareHandler {
  private readonly logger: PinoLogger;

  constructor(logger: Logger) {
    this.logger = logger.getLogger('error-middleware');
  }

  public handler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    this.logger.warn(err, 'error handler fire');
    let response: ErrorResponse;

    if (err instanceof ValidationError && err.isJoi) {
      res.statusCode = HttpStatusCodes.badRequest;
      response = {
        error: err.message,
        details: err.details.map((item) => item.message),
      };
    } else if (err instanceof ClientError) {
      res.statusCode = err.getCode();
      response = {
        error: 'client side error',
        details: [err.message],
      };
    } else if (err instanceof ServerError) {
      res.statusCode = HttpStatusCodes.internalServerError;
      response = {
        error: 'client side error',
        details: [err.message],
        code: err.getCode(),
      };
    } else {
      // todo need change
      res.statusCode = 500;
      response = {
        error: 'internal manager error',
        details: [err.message],
      };
    }

    res.json(response);
  }
}
