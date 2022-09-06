import path from 'path';

import convict from 'convict';
import { load as parseYaml } from 'js-yaml';
import { Logger as PinoLogger } from 'pino';

import { configSchema } from '../../configs/constants';
import { Config } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';

export class AppServer {
  private readonly rootPath : string;

  private readonly logger: Logger;

  private readonly log: PinoLogger;

  private config?: Config;

  constructor(rootPath: string) {
    this.rootPath = path.resolve(rootPath);

    this.loadConfig();
    this.logger = new Logger(this.getConfig().logger);
    this.log = this.logger.getLogger();
  }

  public getConfig(): Config {
    if (!this.config) {
      throw new Error('Application config not loaded');
    }

    return this.config;
  }

  private loadConfig(): void {
    convict.addParser({
      extension: [
        'yaml',
      ],
      parse: parseYaml,
    });
    const config = convict(configSchema);

    config.loadFile(
      path.join(
        this.rootPath,
        'configs',
        'config.yaml',
      ),
    );

    config.validate({
      allowed: 'strict',
    });

    this.config = config.getProperties();
  }
}
