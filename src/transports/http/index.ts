import { Logger as PinoLogger } from 'pino';
import { TransportsHttpConfig } from '../../../configs/interfaces';
import { Logger } from '../../libraries/logger';

export class HttpServer {
  private readonly log: PinoLogger;

  private readonly config: TransportsHttpConfig;

  constructor(config: TransportsHttpConfig, logger: Logger) {

  }
}
