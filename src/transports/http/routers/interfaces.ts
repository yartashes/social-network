import { Router } from 'express';

export interface HttpRouter {
  readonly path: string;
  init(): Router;
}

export interface ErrorResponse {
  error: string;
  details: Array<string>;
  code?: number;
}
