import { Logger as PinoLogger } from 'pino';
import _ from 'lodash';

import { Repositories } from '../repositories';
import { Resources } from '../resources';
import { Jwt } from '../libraries/jwt';

import { Params } from './interfaces';
import { ImageTools } from '../libraries/image-tools';

export class BaseService {
  protected readonly log: PinoLogger;

  protected readonly repositories: Repositories;

  protected readonly resources: Resources;

  protected readonly jwt: Jwt;

  protected readonly imageTools: ImageTools;

  constructor(params: Params) {
    this.log = params.logger.getLogger(
      _.kebabCase(this.constructor.name),
    );
    this.resources = params.resources;
    this.repositories = params.repositories;
    this.jwt = params.jwt;
    this.imageTools = params.imageTools;
  }
}
