/* eslint-disable no-async-promise-executor */
import {
  Admin, Kafka, LogEntry, logLevel as Loglevel,
} from 'kafkajs';

import { Config } from '../../../configs/interfaces';

import { LoggerFunction } from '../../transports/kafka/interfaces';

import { ServerErrorCodes } from '../../libraries/constants/server-error-codes';
import { ServerError } from '../../libraries/errors/server';

import {
  Directions, Migration, MigrationData, ResourceTypes,
} from '../interfaces';
import { Executor } from '../executor';
import { KafkaBaseMigration } from './base';

export class KafkaMigration extends Executor implements Migration {
  private readonly migrationTopic = 'migrations';

  private client?: Kafka;

  private admin?: Admin;

  private replication = 1;

  public get type(): ResourceTypes {
    return ResourceTypes.kafka;
  }

  public async run(version: string): Promise<void> {
    if (!this.client) {
      throw new ServerError(
        'Not connected to kafka',
        ServerErrorCodes.notConnectedToKafkaInMigration,
      );
    }

    this.admin = this.client.admin();
    await this.admin.connect();

    const producer = this.client.producer({});
    await producer.connect();

    await this.init();

    const lastVersion = await this.getLastVersion();
    const migrations = await this.getMigrations(
      lastVersion,
      version,
    );

    // todo added recuriya to handle promise chain
    await migrations.reduce(
      async (acc, migration) => {
        const migrate = migration.instance[migration.direction].bind(migration.instance);
        await migrate();

        await producer.send({
          topic: this.migrationTopic,
          messages: [
            {
              value: migration.version,
            },
          ],
        });

        return acc;
      },
      Promise.resolve(0),
    );
    await producer.disconnect();
    await this.admin.disconnect();
  }

  public async connect(config: Config): Promise<void> {
    const conf = config.transports.kafka;
    this.replication = conf.replication;

    this.client = new Kafka({
      brokers: conf.brokers.split(','),
      clientId: 'migrations',
      logCreator: (logLevel) => this.createLogger(logLevel),
    });
  }

  protected async createMigrationInstance(
    direction: Directions,
    files: Array<string>,
  ): Promise<Array<MigrationData>> {
    if (!this.admin) {
      throw new ServerError(
        'Not initialized to kafka admin',
        ServerErrorCodes.notInitializedToKafkaAdmin,
      );
    }

    const { admin } = this;

    return Promise.all<MigrationData>(
      files.map(async (file) => {
        const Class = await Executor.load<typeof KafkaBaseMigration>(file);
        const instance = new Class(
          admin,
          this.logger,
          this.replication,
        );

        return {
          instance,
          direction,
          version: instance.getName(),
        };
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      this.logger[level]({ entry }, 'migration kafka driver');
    };
  }

  private async init(): Promise<void> {
    if (!this.admin) {
      throw new ServerError(
        'Not initialized to kafka admin',
        ServerErrorCodes.notInitializedToKafkaAdmin,
      );
    }

    const topics = await this.admin.listTopics();

    if (topics.includes(this.migrationTopic)) {
      return undefined;
    }

    await this.admin.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: this.migrationTopic,
          numPartitions: 1,
          replicationFactor: this.replication,
          configEntries: [
            {
              name: 'retention.ms',
              value: '-1',
            },
          ],
        },
      ],
    });

    return undefined;
  }

  private async getLastVersion(): Promise<string> {
    if (!this.client) {
      throw new ServerError(
        'Not connected to kafka',
        ServerErrorCodes.notConnectedToKafkaInGetMigrationLastVersion,
      );
    }

    if (!this.admin) {
      throw new ServerError(
        'Not initialized to kafka admin',
        ServerErrorCodes.notInitializedToKafkaAdmin,
      );
    }

    const [topicInfo] = await this.admin.fetchTopicOffsets(this.migrationTopic);

    await this.admin.setOffsets({
      groupId: this.migrationTopic,
      topic: this.migrationTopic,
      partitions: [
        {
          partition: topicInfo.partition,
          offset: (parseInt(topicInfo.offset, 10) - 1).toString(),
        },
      ],
    });

    const consumer = this.client.consumer({
      groupId: this.migrationTopic,
    });

    await consumer.subscribe({
      topic: this.migrationTopic,
    });

    return new Promise(async (resolve) => {
      const timer = setTimeout(async () => {
        await consumer.disconnect();
        resolve('');
      }, 10000);

      await consumer.run({
        eachMessage: async (payload) => {
          if (payload.topic === this.migrationTopic) {
            clearTimeout(timer);
            resolve((payload.message.value || '').toString());
          }
        },
      });
    });
  }
}
