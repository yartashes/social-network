/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
import { Logger as PinoLogger } from 'pino';
import { Response, NextFunction } from 'express';

import { ValidationError } from 'joi';
import { Logger } from '../../../libraries/logger';

import { Request } from '../interfaces';

import { ErrorMiddlewareHandler } from './interface';
import { ErrorResponse } from '../routers/interfaces';

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
      res.statusCode = 400;
      response = {
        error: err.message,
        details: err.details.map((item) => item.message),
      };
    } else {
      res.statusCode = 500;
      response = {
        error: 'internal server error',
        details: [err.message],
      };
    }

    res.json(response);
  }
}
