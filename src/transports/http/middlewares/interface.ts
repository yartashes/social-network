/* eslint-disable no-unused-vars */
import { Response, NextFunction } from 'express';

import { Request } from '../interfaces';

type ErrorMiddlewareParameters = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

type MiddlewareParameters = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

export interface MiddlewareHandler {
  handler: MiddlewareParameters;
}

export interface ErrorMiddlewareHandler {
  handler: ErrorMiddlewareParameters;
}
