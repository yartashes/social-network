import { Router } from 'express';

import { Request } from '../interfaces';

import { HttpRouter } from './interfaces';
import { BaseRouter } from './base';

export class MediasRouter extends BaseRouter implements HttpRouter {
  public get path(): string {
    return '/api/media';
  }

  public init(): Router {
    this.log.info('Media router init');
    const router = Router();

    router
      .post(
        '/upload',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.handlers.medias.upload(newReq, res, next);
        },
      );

    return router;
  }
}
