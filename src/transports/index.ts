import { Transport } from './interfaces';
import { TransportsConfig } from '../../configs/interfaces';
import { Logger } from '../libraries/logger';
import { HttpServer } from './http';

export class Transports {
  private readonly transports: Array<Transport>;

  constructor(config: TransportsConfig, logger: Logger) {
    this.transports = [
      new HttpServer(config.http, logger),
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
