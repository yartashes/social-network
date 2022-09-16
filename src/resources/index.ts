import { Logger as PinoLogger } from 'pino';

import { ResourcesConfig } from '../../configs/interfaces';

import { Logger } from '../libraries/logger';

import { Resource, ResourceType } from './interfaces';
import { BaseResource } from './base';
import { PostgresResource } from './postgresql';
import { MailjetResource } from './mail/mailjet';
import { Mail } from './mail/interfaces';

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

  public get mail(): Mail {
    return (this.resources[ResourceType.mail] as MailjetResource) as Mail;
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
    ];
  }
}
