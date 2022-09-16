import Mailjet, { Client } from 'node-mailjet';

import { ResourceMailjetConfig } from '../../../configs/interfaces';
import { Logger } from '../../libraries/logger';

import { BaseResource } from '../base';

import { Resource, ResourceType } from '../interfaces';
import { Mail, SenderInfo } from './interfaces';

export class MailjetResource
  extends BaseResource
  implements Resource, Mail {
  private readonly client: Client;

  constructor(config: ResourceMailjetConfig, logger: Logger) {
    super(logger);

    this.log.info('connecting to mailjet');
    this.client = Mailjet.apiConnect(
      config.public,
      config.private,
    );
  }

  public get type(): ResourceType {
    return ResourceType.mail;
  }

  private get from(): SenderInfo {
    return {
      Email: 'no-reply@falconsystem.me',
      Name: 'Robot',
    };
  }

  public async signup(email: string, code: number): Promise<unknown> {
    const result = await this.client
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: this.from,
            To: [
              {
                Email: email,
              },
            ],
            Subject: 'Signup verification',
            TextPart: `Signup verification code: ${code}`,
            HTMLPart: `<h3>Signup verification code</h3><br /><h1>${code}</h1>`,
          },
        ],
      });

    return result;
  }

  public async start(): Promise<void> {}

  public async stop(): Promise<void> {}
}
