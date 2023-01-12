import { Logger as PinoLogger } from 'pino';

import { Config } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';

import { Migration as MigrationInterface } from './interfaces';
import { KafkaMigration } from './kafka';
import { PostgresMigration } from './postgres';

export class Migration {
  private readonly log: PinoLogger;

  private readonly config: Config;

  private readonly migrations: Array<MigrationInterface>;

  constructor(config: Config, logger: Logger) {
    this.log = logger.getLogger('migration');
    this.config = config;

    this.migrations = this.init();
  }

  public async start(): Promise<void> {
    this.log.info('migration connect to resource');

    await this.migrations.reduce(
      async (
        wait,
        migration,
      ) => {
        await migration.connect(this.config);

        return wait;
      },
      Promise.resolve(),
    );

    this.log.info('migration start migrate');

    // todo added recuriya to handle promise chain
    await this.migrations.reduce(
      async (wait, migration) => {
        await migration.run(this.config.migration[migration.type] || '');

        return wait;
      },
      Promise.resolve(),
    );

    this.log.info('migration finish migrate');
    // todo added http manager for metrics
  }

  private init(): Array<MigrationInterface> {
    return [
      new KafkaMigration(this.log),
      new PostgresMigration(this.log),
    ];
  }
}
