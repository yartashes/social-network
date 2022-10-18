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
import { Resources } from '../resources';
import { Params } from '../services/interfaces';
import { Services } from '../services';
import { Jwt } from '../libraries/jwt';
import { ImageTools } from '../libraries/image-tools';

export class AppServer {
  private readonly rootPath : string;

  private readonly logger: Logger;

  private readonly log: PinoLogger;

  private config?: Config;

  private transports?: Transport;

  private resources?: Resources;

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
    await this.resources?.stop();
    await this.transports?.stop();
  }

  public async start(): Promise<void> {
    await this.resources?.start();
    await this.transports?.start();
  }

  public async init(): Promise<void> {
    this.resources = new Resources(this.getConfig().resources, this.logger);

    const repositories = new Repositories(this.resources, this.logger);
    const jwt = new Jwt(this.getConfig().app.jwt);
    const imageTools = new ImageTools();

    const params: Params = {
      repositories,
      jwt,
      imageTools,
      logger: this.logger,
      resources: this.resources,
    };

    const services = new Services(params);

    this.transports = new Transports(
      services,
      jwt,
      this.getConfig().transports,
      this.logger,
    );
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
