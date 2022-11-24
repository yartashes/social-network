/* eslint-disable max-classes-per-file,@typescript-eslint/no-unused-vars */
import path from 'path';

import {
  Pool,
  PoolClient,
} from 'pg';
import migration from 'node-pg-migrate';
import MigrationBuilder from 'node-pg-migrate/dist/migration-builder';

import { ResourcePostgresConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';

import { Resource, ResourceType } from '../interfaces';
import { BaseResource } from '../base';

export class PostgresResource extends BaseResource implements Resource {
  private readonly pool: Pool;

  private client?: PoolClient;

  constructor(config: ResourcePostgresConfig, logger: Logger) {
    super(logger);

    this.log.info('create postgres pool');
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.db,
      user: config.user,
      password: config.password,
    });
  }

  public get type(): ResourceType {
    return ResourceType.postgres;
  }

  public getClient(): PoolClient {
    if (!this.client) {
      throw new Error('Postgres Sql client not initialized');
    }

    return this.client;
  }

  public async start(): Promise<void> {
    this.log.info('connecting to postgres');
    this.client = await this.pool.connect();
    this.log.info('connected to postgres');

    // this.log.info('start migration');
    // await migration({
    //   log: (msg: string) => {
    //     this.log.info(msg);
    //   },
    //   dbClient: this.client,
    //   migrationsTable: 't_migrations',
    //   dir: path.join(
    //     __dirname,
    //     'migrations',
    //   ),
    //   direction: 'up',
    // });
    // this.log.info('finish migration');
  }

  public async stop(): Promise<void> {
    this.log.info('disconnecting to postgres');
    await this.pool.end();
    this.log.info('disconnected to postgres');
  }
}
