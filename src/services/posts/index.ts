import { BaseService } from '../base';

import { Posts } from '../interfaces';

import { PostCreateParams } from './interfaces';

export class PostsService extends BaseService implements Posts {
  public async create(params: PostCreateParams): Promise<string> {
    return '';
  }
}
