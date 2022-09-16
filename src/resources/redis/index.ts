import IORedis, { Redis as RedisBase } from 'ioredis';

import { ResourceRedisConfig } from '../../../configs/interfaces';

import { Logger } from '../../libraries/logger';

import { Resource, ResourceType } from '../interfaces';
import { BaseResource } from '../base';

export class RedisResource extends BaseResource implements Resource {
  private readonly client: RedisBase;

  constructor(config: ResourceRedisConfig, logger: Logger) {
    super(logger);

    this.log.info('connecting to redis');
    this.client = new IORedis({
      host: config.host,
      port: config.port,
      db: config.db,
    });
    this.log.info('connected to redis');
  }

  public get type(): ResourceType {
    return ResourceType.redis;
  }

  public getClient(): RedisBase {
    return this.client;
  }

  public async start(): Promise<void> {}

  public async stop(): Promise<void> {}
}
