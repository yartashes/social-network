/* eslint-disable no-async-promise-executor */
import { Pool, PoolClient } from 'pg';

import { Config } from '../../../configs/interfaces';

import { ServerErrorCodes } from '../../libraries/constants/server-error-codes';
import { ServerError } from '../../libraries/errors/server';

import {
  Directions,
  Migration,
  MigrationData,
  ResourceTypes,
} from '../interfaces';
import { Executor } from '../executor';

import { PostgresBaseMigration } from './base';

export class PostgresMigration extends Executor implements Migration {
  private readonly migrationTable = 'migrations';

  private client?: PoolClient;

  private pool?: Pool;

  public get type(): ResourceTypes {
    return ResourceTypes.postgres;
  }

  public async connect(config: Config): Promise<void> {
    const conf = config.resources.postgres;
    this.pool = new Pool({
      host: conf.host,
      port: conf.port,
      database: conf.db,
      user: conf.user,
      password: conf.password,
    });

    this.client = await this.pool.connect();
  }

  public async run(version: string): Promise<void> {
    if (!this.client) {
      throw new ServerError(
        'Not connected to postgres',
        ServerErrorCodes.notConnectedToPostgresInMigration,
      );
    }

    await this.init();

    const lastVersion = await this.getLastVersion();
    const migrations = await this.getMigrations(
      lastVersion,
      version,
    );

    const { client } = this;

    // todo added recuriya to handle promise chain
    await migrations.reduce(
      async (acc, migration) => {
        await client.query('BEGIN');
        const migrate = migration.instance[migration.direction].bind(migration.instance);

        try {
          await migrate();
          await client.query(
            `
                INSERT INTO ${this.migrationTable}(version)
                VALUES ($1);
            `,
            [
              migration.version,
            ],
          );
          await client.query('COMMIT');
        } catch (e) {
          this.logger.error(e);
          await client.query('ROLLBACK');
        }

        return acc;
      },
      Promise.resolve(0),
    );

    await this.pool?.end();
  }

  protected async createMigrationInstance(
    direction: Directions,
    files: Array<string>,
  ): Promise<Array<MigrationData>> {
    if (!this.client) {
      throw new ServerError(
        'Not connected to postgres',
        ServerErrorCodes.notConnectedToPostgresInMigration,
      );
    }

    const { client } = this;

    return Promise.all<MigrationData>(
      files.map(async (file) => {
        const Class = await Executor.load<typeof PostgresBaseMigration>(file);
        const instance = new Class(
          client,
          this.logger,
        );

        return {
          instance,
          direction,
          version: instance.getName(),
        };
      }),
    );
  }

  private async init(): Promise<void> {
    if (!this.client) {
      throw new ServerError(
        'Not connected to postgres',
        ServerErrorCodes.notConnectedToPostgresInMigration,
      );
    }

    await this.client.query(
      `
        CREATE TABLE IF NOT EXISTS ${this.migrationTable}
        (
          id SERIAL CONSTRAINT t_migrations_pk PRIMARY KEY,
          version VARCHAR(60) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
     `,
    );

    return undefined;
  }

  private async getLastVersion(): Promise<string> {
    if (!this.client) {
      throw new ServerError(
        'Not connected to postgres',
        ServerErrorCodes.notConnectedToPostgresInMigration,
      );
    }

    const result = await this.client
      .query<{ version: string }>(
        `
          SELECT
            version
          FROM ${this.migrationTable}
          ORDER BY created_at DESC 
          LIMIT 1;
        `,
      );

    if (result.rows.length === 0) {
      return '';
    }

    return result.rows[0].version;
  }
}
