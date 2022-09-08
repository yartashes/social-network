import { Server } from 'http';

import { Logger as PinoLogger } from 'pino';
import express, { Express } from 'express';

import { TransportsHttpConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';
import { Transport } from '../interfaces';
import { Routes } from './routers';

export class HttpServer implements Transport {
  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly config: TransportsHttpConfig;

  private readonly express: Express;

  private server?: Server;

  constructor(config: TransportsHttpConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.log = logger.getLogger('http-server');
    this.express = express();
  }

  public async start(): Promise<void> {
    this.log.info('starting http server');
    new Routes(this.express, this.logger).init();

    this.server = this.express.listen(
      this.config.port,
      this.config.host,
      () => {
        this.log
          .info(`Http server is starting in port ${this.config.port}`);
      },
    );
  }

  public async stop(): Promise<void> {
    if (!this.server) {
      return undefined;
    }

    this.server.close((err) => {
      if (err) {
        this.log.error(err);
      }

      this.log.info('Http server is closed');
    });

    return undefined;
  }
}
