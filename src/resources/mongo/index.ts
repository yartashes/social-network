import { Db, MongoClient } from 'mongodb';

import { ResourceMongoConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';

import { Resource, ResourceType } from '../interfaces';
import { BaseResource } from '../base';

export class MongoResource extends BaseResource implements Resource {
  private readonly client: MongoClient;

  private readonly config: ResourceMongoConfig;

  private db?: Db;

  constructor(config: ResourceMongoConfig, logger: Logger) {
    super(logger);

    this.log.info('create mongo client');
    this.config = config;
    this.client = new MongoClient(
      MongoResource.makeUrl(config),
    );
  }

  public get type(): ResourceType {
    return ResourceType.mongo;
  }

  public getClient(): Db {
    if (!this.db) {
      throw new Error('Mongo client not initialized');
    }

    return this.db;
  }

  public async start(): Promise<void> {
    this.log.info('connecting to mongo');
    await this.client.connect();
    this.log.info('connected to mongo');

    this.db = this.client.db(
      this.config.db,
      {
        readPreference: 'secondaryPreferred',
      },
    );
  }

  public async stop(): Promise<void> {
    this.log.info('disconnecting to mongo');
    await this.client.close();
    this.log.info('disconnected to mongo');
  }

  private static makeUrl(config: ResourceMongoConfig): string {
    return `mongodb://${config.auth.user}:${config.auth.password}@${config.hosts.join(',')}/?replicaSet=${config.rs.name}&authSource=${config.db}`;
  }
}
