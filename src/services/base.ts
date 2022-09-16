import { Logger as PinoLogger } from 'pino';
import _ from 'lodash';

import { Params } from './interfaces';
import { Repositories } from '../repositories';
import { Resources } from '../resources';

export class BaseService {
  protected readonly log: PinoLogger;

  protected readonly repositories: Repositories;

  protected readonly resources: Resources;

  constructor(params: Params) {
    this.log = params.logger.getLogger(
      _.kebabCase(this.constructor.name),
    );
    this.resources = params.resources;
    this.repositories = params.repositories;
  }
}
