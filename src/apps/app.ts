import path from 'path';

import convict from 'convict';
import { load as parseYaml } from 'js-yaml';
import { Logger as PinoLogger } from 'pino';

import { configSchema } from '../../configs/constants';
import { Config } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';
import { Transport } from '../transports/interfaces';
import { Transports } from '../transports';
import { Repositories } from '../repositories';

export class AppServer {
  private readonly rootPath : string;

  private readonly logger: Logger;

  private readonly log: PinoLogger;

  private config?: Config;

  private transports?: Transport;

  private repositories?: Repositories;

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

  public async stop(): Promise<void> {
    await this.repositories?.stop();
    await this.transports?.stop();
  }

  public async start(): Promise<void> {
    await this.repositories?.start();
    await this.transports?.start();
  }

  public async init(): Promise<void> {
    this.transports = new Transports(this.getConfig().transports, this.logger);
    this.repositories = new Repositories(this.getConfig().resources, this.logger);
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
