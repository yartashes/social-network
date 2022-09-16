import { Logger as PinoLogger } from 'pino';
import _ from 'lodash';

import { Logger } from '../libraries/logger';

import { Resource } from '../resources/interfaces';

export class BaseRepository<T extends Resource> {
  protected readonly db: T;

  protected readonly log: PinoLogger;

  constructor(db: T, logger: Logger) {
    this.db = db;

    this.log = logger.getLogger(
      _.kebabCase(this.constructor.name),
    );
  }
}
