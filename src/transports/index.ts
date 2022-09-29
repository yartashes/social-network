import { TransportsConfig } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';
import { Services } from '../services';

import { Transport } from './interfaces';
import { HttpServer } from './http';
import { Jwt } from '../libraries/jwt';

export class Transports {
  private readonly transports: Array<Transport>;

  constructor(
    services: Services,
    jwt: Jwt,
    config: TransportsConfig,
    logger: Logger,
  ) {
    this.transports = [
      new HttpServer(services, jwt, config.http, logger),
    ];
  }

  public async stop(): Promise<void> {
    await Promise.all(
      this.transports
        .map((item) => item.stop()),
    );
  }

  public async start(): Promise<void> {
    await Promise.all(
      this.transports
        .map((item) => item.start()),
    );
  }
}
