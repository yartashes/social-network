import { PoolClient } from 'pg';
import { Logger } from 'pino';

import { BaseMigration } from '../base';

export class PostgresBaseMigration extends BaseMigration {
  protected readonly client: PoolClient;

  constructor(client: PoolClient, logger: Logger) {
    super(logger);

    this.client = client;
  }
}
