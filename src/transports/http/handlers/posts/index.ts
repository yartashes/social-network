import { NextFunction, Response as ExpressResponse } from 'express';

import { PostCreateParams } from '../../../../services/posts/interfaces';

import { ServiceTypes } from '../../../../libraries/constants/service-types';

import { Request } from '../../interfaces';

import { HttpBaseHandler } from '../base';

import { createRequest } from './constants';
import { CreatePostResponse } from './interfaces';

export class PostsHandler extends HttpBaseHandler {
  public get service(): ServiceTypes {
    return ServiceTypes.posts;
  }

  public async create(
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
