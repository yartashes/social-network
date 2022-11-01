import { TransportsConfig } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';
import { Services } from '../services';

import { Transport } from './interfaces';
import { HttpTransport } from './http';
import { Jwt } from '../libraries/jwt';
import { LocalTransport } from './local';

export class Transports {
  private readonly transports: Array<Transport>;

  constructor(
    services: Services,
    jwt: Jwt,
    config: TransportsConfig,
    logger: Logger,
  ) {
    this.transports = [
      new HttpTransport(services, jwt, config.http, logger),
      new LocalTransport(services, logger),
    ];
  }

  public getTransports(): Array<Transport> {
    return this.transports;
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
