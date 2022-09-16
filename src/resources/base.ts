import { Logger as PinoLogger } from 'pino';
import _ from 'lodash';

import { Logger } from '../libraries/logger';
import { Resource, ResourceType } from './interfaces';

export class BaseResource implements Resource {
  protected readonly log: PinoLogger;

  constructor(logger: Logger) {
    this.log = logger.getLogger(
      _.kebabCase(this.constructor.name),
    );
  }

  public get type(): ResourceType {
    throw new Error('Resource type getter not implemented');
  }

  public async start(): Promise<void> {
    throw new Error('Resource start method not implemented');
  }

  public async stop(): Promise<void> {
    throw new Error('Resource stop method not implemented');
  }
}
