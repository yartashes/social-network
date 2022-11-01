import { Logger as PinoLogger } from 'pino';

import { Logger } from '../../libraries/logger';
import { TransportTypes } from '../../libraries/constants/transport-types';

import { Services } from '../../services';

import { HandlerInfo, Transport } from '../interfaces';

import { Handlers } from './handlers';

export class LocalTransport implements Transport {
  private readonly handlers: Handlers;

  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly services: Services;

  constructor(services: Services, logger: Logger) {
    this.logger = logger;
    this.services = services;

    this.log = logger.getLogger('local-transport');

    this.handlers = new Handlers(services);
  }

  public get handlerInfo(): HandlerInfo {
    return {
      type: TransportTypes.local,
      handlers: this.handlers,
    };
  }

  public async start(): Promise<void> {
    this.log.info('local transport started');
  }

  public async stop(): Promise<void> {
    this.log.info('local transport stopped');
  }
}
