import { Logger as PinoLogger } from 'pino';

import { ResourcesConfig } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';

import { Resource, ResourceType } from './interfaces';
import { BaseResource } from './base';

import { PostgresResource } from './postgresql';

import { MailjetResource } from './mail/mailjet';
import { Mail } from './mail/interfaces';

import { RedisResource } from './redis';

import { S3Resource } from './storage/s3';
import { Storage } from './storage/interfaces';
import { MongoResource } from './mongo';

export class Resources {
  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly config: ResourcesConfig;

  private readonly resources: Record<ResourceType, BaseResource>;

  constructor(config: ResourcesConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.log = logger.getLogger('repositories');

    this.resources = Object.fromEntries(
      this.init()
        .map<[ResourceType, Resource]>((resource) => ([resource.type, resource])),
    ) as Record<ResourceType, BaseResource>;
  }

  public get postgres(): PostgresResource {
    return this.resources[ResourceType.postgres] as PostgresResource;
  }

  public get redis(): RedisResource {
    return this.resources[ResourceType.redis] as RedisResource;
  }

  public get mail(): Mail {
    return (this.resources[ResourceType.mail] as MailjetResource) as Mail;
  }

  public get storage(): Storage {
    return (this.resources[ResourceType.s3] as S3Resource) as Storage;
  }

  public get mongo(): MongoResource {
    return this.resources[ResourceType.mongo] as MongoResource;
  }

  public async stop(): Promise<void> {
    await Promise.all(
      Object.values(this.resources)
        .map((item) => item.stop()),
    );
  }

  public async start(): Promise<void> {
    await Promise.all(
      Object.values(this.resources)
        .map((item) => item.start()),
    );
  }

  private init(): Array<BaseResource> {
    return [
      new PostgresResource(this.config.postgres, this.logger),
      new MailjetResource(this.config.mailjet, this.logger),
      new RedisResource(this.config.redis, this.logger),
      new S3Resource(this.config.s3, this.logger),
      new MongoResource(this.config.mongo, this.logger),
    ];
  }
}
