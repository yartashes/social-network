import { Server } from 'http';

import { Logger as PinoLogger } from 'pino';
import express, { Express } from 'express';

import { TransportHttpConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';
import { Jwt } from '../../libraries/jwt';
import { TransportTypes } from '../../libraries/constants/transport-types';

import { Services } from '../../services';

import { HandlerInfo, Transport } from '../interfaces';

import { Routes } from './routers';
import { Handlers } from './handlers';
import { AxiosSender } from './sender';

export class HttpTransport implements Transport {
  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly config: TransportHttpConfig;

  private readonly express: Express;

  private readonly services: Services;

  private readonly jwt: Jwt;

  private readonly handlers: Handlers;

  private server?: Server;

  constructor(
    services: Services,
    jwt: Jwt,
    config: TransportHttpConfig,
    logger: Logger,
  ) {
    this.config = config;
    this.logger = logger;
    this.services = services;
    this.jwt = jwt;

    this.log = logger.getLogger('http-transport');
    this.express = express();

    this.handlers = new Handlers(
      services,
      new AxiosSender(),
    );
  }

  public get handlerInfo(): HandlerInfo {
    return {
      type: TransportTypes.http,
      handlers: this.handlers,
    };
  }

  public async start(): Promise<void> {
    this.log.info('starting http manager');
    new Routes(
      this.services,
      this.handlers,
      this.express,
      this.jwt,
      this.logger,
    )
      .init();

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

      this.log.info('Http manager is closed');
    });

    return undefined;
  }
}
