import path from 'path';

import { Pool, PoolClient } from 'pg';
import migration from 'node-pg-migrate';
import { Logger as PinoLogger } from 'pino';

import { ResourcePostgresConfig } from '../../../../configs/interfaces';

import { Logger } from '../../../libraries/logger';

import { Resource } from '../interfaces';

export class Postgresql implements Resource {
  private readonly log: PinoLogger;

  private readonly pool: Pool;

  private client?: PoolClient;

  constructor(config: ResourcePostgresConfig, logger: Logger) {
    this.log = logger.getLogger('postgres-client');

    this.log.info('create postgres pool');
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.db,
      user: config.user,
      password: config.password,
    });
  }

  public async start(): Promise<void> {
    this.log.info('connecting to postgres');
    this.client = await this.pool.connect();
    this.log.info('connected to postgres');

    this.log.info('start migration');
    await migration({
      log: (msg: string) => {
        this.log.info(msg);
      },
      dbClient: this.client,
      migrationsTable: 't_migrations',
      dir: path.join(
        __dirname,
        'migrations',
      ),
      direction: 'up',
    });
    this.log.info('finish migration');
  }

  public async stop(): Promise<void> {
    this.log.info('disconnecting to postgres');
    await this.pool.end();
    this.log.info('disconnected to postgres');
  }
}
