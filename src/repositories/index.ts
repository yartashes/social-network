import { Logger as PinoLogger } from 'pino';

import { Logger } from '../libraries/logger';
import { ResourcesConfig } from '../../configs/interfaces';
import { Resources } from './resources';

export class Repositories {
  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly config: ResourcesConfig;

  private readonly resources: Resources;

  constructor(config: ResourcesConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.log = logger.getLogger('repositories');

    this.resources = new Resources(this.config, this.logger);
  }

  public async stop(): Promise<void> {
    await this.resources.stop();
  }

  public async start(): Promise<void> {
    await this.resources.start();
  }
}
