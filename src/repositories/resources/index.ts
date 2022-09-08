import { Logger as PinoLogger } from 'pino';

import { ResourcesConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';

import { Resource } from './interfaces';
import { Postgresql } from './postgresql';

export class Resources {
  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly config: ResourcesConfig;

  private readonly resources: Array<Resource>;

  constructor(config: ResourcesConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.log = logger.getLogger('repositories');

    this.resources = this.init();
  }

  public async stop(): Promise<void> {
    await Promise.all(
      this.resources
        .map((item) => item.stop()),
    );
  }

  public async start(): Promise<void> {
    await Promise.all(
      this.resources
        .map((item) => item.start()),
    );
  }

  private init(): Array<Resource> {
    return [
      new Postgresql(this.config.postgres, this.logger),
    ];
  }
}
