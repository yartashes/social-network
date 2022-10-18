import { Db, MongoClient } from 'mongodb';
import { Document, ObjectId } from 'bson';

import _ from 'lodash';

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

  public serialize<M, D extends Document>(model: M): D {
    return Object.fromEntries(
      Object.entries(model)
        .map(([key, value]) => {
          const newKey = key === 'id' ? '_id' : _.snakeCase(key);
          let newValue;

          switch (true) {
          case Array.isArray(value):
            newValue = value.map((elm) => {
              switch (true) {
              case ObjectId.isValid(elm) && /[0-9a-fA-F]{24}/.test(elm):
                return new ObjectId(elm);
              case typeof value === 'object':
                return this.serialize(elm);
              default:
                return elm;
              }
            });
            break;
          case ObjectId.isValid(value) && /[0-9a-fA-F]{24}/.test(value):
            newValue = new ObjectId(value);
            break;
          case typeof value === 'object':
            newValue = this.serialize(value);
            break;
          default:
            newValue = value;
            break;
          }

          return [newKey, newValue];
        }),
    ) as D;
  }

  public deserialize<D extends Document, M>(doc: D): M {
    return Object.fromEntries(
      Object.entries(doc)
        .map(([key, value]) => {
          const newKey = _.camelCase(key);
          let newValue;

          switch (true) {
          case Array.isArray(value):
            newValue = value.map((elm) => {
              switch (true) {
              case elm.constructor && elm.constructor.name === 'ObjectId':
                return elm.toString();
              case typeof value === 'object':
                return this.serialize(elm);
              default:
                return elm;
              }
            });
            break;
          case value.constructor && value.constructor.name === 'ObjectId':
            newValue = value.toString();
            break;
          case typeof value === 'object':
            newValue = this.serialize(value);
            break;
          default:
            newValue = value;
            break;
          }

          return [newKey, newValue];
        }),
    ) as M;
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
