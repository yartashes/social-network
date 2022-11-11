import { Services } from '../../../services';

import { Handlers as HandlersInterface } from '../../interfaces';
import { BaseHandler } from '../../base-handler';

import { Handler } from './interfaces';

export class Handlers implements HandlersInterface {
  private readonly handlers: Handler;

  constructor(services: Services) {
    this.handlers = {};
  }

  public getHandlers(): Array<BaseHandler> {
    return Object.values(this.handlers);
  }
}
