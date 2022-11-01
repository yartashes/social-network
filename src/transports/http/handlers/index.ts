import { Services } from '../../../services';

import { Handlers as HandlersInterface } from '../../interfaces';
import { BaseHandler } from '../../base-handler';

import { Sender } from '../sender/interfaces';

import { Handler } from './interfaces';

import { AuthHandler } from './auth';
import { MediasHandler } from './medias';
import { PostsHandler } from './posts';

export class Handlers implements HandlersInterface {
  private readonly handlers: Handler;

  constructor(services: Services, sender: Sender) {
    this.handlers = {
      auth: new AuthHandler(services, sender),
      medias: new MediasHandler(services, sender),
      posts: new PostsHandler(services, sender),
    };
  }

  public get auth(): AuthHandler {
    return this.handlers.auth;
  }

  public get medias(): MediasHandler {
    return this.handlers.medias;
  }

  public get posts(): PostsHandler {
    return this.handlers.posts;
  }

  public getHandlers(): Array<BaseHandler> {
    return Object.values(this.handlers);
  }
}
