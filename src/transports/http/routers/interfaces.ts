import { Router } from 'express';

export interface HttpRouter {
  readonly path: string;
  init(): Router;
}
