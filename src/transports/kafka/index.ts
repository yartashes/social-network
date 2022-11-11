import { Logger as PinoLogger } from 'pino';
import {
  Kafka,
  LogEntry,
  logLevel as Loglevel,
  Producer,
} from 'kafkajs';

import { TransportKafkaConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';

import { TransportTypes } from '../../libraries/constants/transport-types';

import { Services } from '../../services';

import { HandlerInfo, Transport } from '../interfaces';

import { Handlers } from './handlers';
import { LoggerFunction } from './interfaces';
import { Migration } from './migration';

export class KafkaTransport implements Transport {
  private readonly handlers: Handlers;

  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly services: Services;

  private readonly config: TransportKafkaConfig;

  private readonly client: Kafka;

  private producer?: Producer;

  constructor(services: Services, config: TransportKafkaConfig, logger: Logger) {
    this.logger = logger;
    this.services = services;
    this.config = config;

    this.log = logger.getLogger('kafka-transport');

    this.handlers = new Handlers(services);

    this.client = new Kafka({
      brokers: config.brokers.split(','),
      clientId: config.id,
      logCreator: (logLevel) => this.createLogger(logLevel),
    });
  }

  public get handlerInfo(): HandlerInfo {
    return {
      type: TransportTypes.kafka,
      handlers: this.handlers,
    };
  }

  public async start(): Promise<void> {
    this.log.info('kafka transport starting');
    const admin = this.client.admin();
    await admin.connect();

    const migration = new Migration(admin, this.log, this.config.replication);
    await migration.migrate(this.config.migration.version);
    // this.producer = await this.client.producer({
    //
    // });
  }

  public async stop(): Promise<void> {
    this.log.info('local transport stopping');
  }

  private createLogger(logLevel: Loglevel): LoggerFunction {
    return (entry: LogEntry) => {
      let level = 'error';

      switch (entry.level) {
        case Loglevel.DEBUG:
          level = 'debug';
          break;
        case Loglevel.INFO:
          level = 'info';
          break;
        case Loglevel.ERROR:
          level = 'error';
          break;
        case Loglevel.WARN:
          level = 'warn';
          break;
        default:
          break;
      }

      this.log[level]({ entry }, 'kafka driver');
    }
  }

  private async migrate(): Promise<void> {
    this.log.info('starting migration');
    // const dbVersion = await this.getVersion(type);
    // const migrations = await this.getMigrations(
    //   dbVersion,
    //   this.config.db[this.config.app.db.type].version,
    //   type,
    // );
    //
    // await Promise.all(
    //   migrations.map(async (migration) => {
    //     if (migration.direction === Direction.up) {
    //       await this.setVersion(migration.version, type);
    //       await migration.instance.up();
    //     } else if (migration.direction === Direction.down) {
    //       await this.deleteVersion(migration.version, type);
    //       await migration.instance.down();
    //     }
    //   }),
    // );

    this.log.info('finish migration');
  }
}
