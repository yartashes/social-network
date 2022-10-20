import { Logger as PinoLogger } from 'pino';
import {
  NextFunction,
  Response as ExpressResponse,
  Router,
} from 'express';

import { Logger } from '../../../../libraries/logger';

import { Services } from '../../../../services';

import { Request } from '../../interfaces';

import { HttpRouter } from '../interfaces';
import { CreatePostResponse } from './interfaces';
import { createRequest } from './constants';
import { PostCreateParams } from '../../../../services/posts/interfaces';

export class PostRouter implements HttpRouter {
  private readonly log: PinoLogger;

  private readonly services: Services;

  constructor(services: Services, logger: Logger) {
    this.services = services;

    this.log = logger.getLogger('http-post-router');
  }

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

          return this.crate(newReq, res, next);
        },
      );

    return router;
  }

  private async crate(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      const params: PostCreateParams = {
        authorId: req.user.id as bigint,
        title: req.body.title,
      };

      if (req.body.text) {
        params.text = req.body.text;
      }

      if (req.body.images && req.body.images.length > 0) {
        params.images = req.body.images;
      }

      const validation = createRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const postId = await this
        .services
        .posts
        .create(params);

      const response: CreatePostResponse = {
        result: postId,
      };

      return res.json(response);
    } catch (e) {
      next(e);
    }

    return undefined;
  }
}
