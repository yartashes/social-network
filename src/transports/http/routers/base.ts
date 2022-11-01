import { Logger as PinoLogger } from 'pino';
import _ from 'lodash';

import { Logger } from '../../../libraries/logger';

import { Handlers } from '../handlers';

export class BaseRouter {
  protected readonly log: PinoLogger;

  protected readonly handlers: Handlers;

  constructor(handlers: Handlers, logger: Logger) {
    this.handlers = handlers;
    this.log = logger.getLogger(
      _.kebabCase(this.constructor.name),
    );
  }
}
