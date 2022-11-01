import { Services } from '../../../services';

import { Handlers as HandlersInterface } from '../../interfaces';
import { BaseHandler } from '../../base-handler';

import { Handler } from './interfaces';

import { MediasHandler } from './medias';
import { UsersHandler } from './users';

export class Handlers implements HandlersInterface {
  private readonly handlers: Handler;

  constructor(services: Services) {
    this.handlers = {
      medias: new MediasHandler(services),
      users: new UsersHandler(services),
    };
  }

  public get medias(): MediasHandler {
    return this.handlers.medias;
  }

  public get users(): UsersHandler {
    return this.handlers.users;
  }

  public getHandlers(): Array<BaseHandler> {
    return Object.values(this.handlers);
  }
}
