import { Router } from 'express';

import { Request } from '../interfaces';

import { HttpRouter } from './interfaces';
import { BaseRouter } from './base';

export class PostRouter extends BaseRouter implements HttpRouter {
  public get path(): string {
    return '/api/posts';
  }

  public init(): Router {
    this.log.info('Post router init');
    const router = Router();

    router
      .post(
        '/',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.handlers.posts.create(newReq, res, next);
        },
      );

    return router;
  }
}
