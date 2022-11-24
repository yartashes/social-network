import { Admin } from 'kafkajs';
import { Logger } from 'pino';

import { BaseMigration } from '../base';

export class KafkaBaseMigration extends BaseMigration {
  protected readonly client: Admin;

  protected readonly replication: number;

  constructor(client: Admin, logger: Logger, replication: number) {
    super(logger);

    this.client = client;
    this.replication = replication;
  }
}
