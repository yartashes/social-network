import { Image } from '../../domains/image';

import { ServiceTypes } from '../../libraries/constants/service-types';
import { ClientError } from '../../libraries/errors/client';
import { HttpStatusCodes } from '../../libraries/constants/http-status-codes';

import { BaseService } from '../base';

import { Posts } from '../interfaces';

import { PostCreateParams } from './interfaces';

export class PostsService extends BaseService implements Posts {
  public async create(params: PostCreateParams): Promise<string> {
    this.log.debug({ params }, 'create post');
    if (!params.images && !params.text) {
      throw new ClientError(
        'one of these images and text fields must be exists',
        HttpStatusCodes.badRequest,
      );
    }

    const images = new Array<string>();

    if (params.images) {
      const existsImages = await this.requester
        .call<Array<string>, Array<Image>>(
          ServiceTypes.medias,
          'getImageByIds',
          params.images,
        );

      existsImages.forEach((image) => {
        if (image.author === params.authorId) {
          images.push(image.id as string);
        }
      });

      if (images.length === 0) {
        throw new ClientError(
          'none of the images were valid',
          HttpStatusCodes.badRequest,
        );
      }
    }

    const postId = await this.repositories
      .posts
      .create({
        images,
        text: params.text,
        author: params.authorId,
        title: params.title,
      });

    this.log.debug({ postId }, 'created post id');

    return postId;
  }
}
