import { S3 } from 'aws-sdk';

import { Readable } from 'stream';
import { ResourceS3Config } from '../../../configs/interfaces';
import { Logger } from '../../libraries/logger';

import { BaseResource } from '../base';

import { Resource, ResourceType } from '../interfaces';
import { Storage } from './interfaces';

export class S3Resource
  extends BaseResource
  implements Resource, Storage {
  private readonly client: S3;

  private readonly bucket: string;

  constructor(config: ResourceS3Config, logger: Logger) {
    super(logger);

    this.bucket = config.bucket;

    this.log.info('connecting to s3');
    this.client = new S3({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.host,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  public get type(): ResourceType {
    return ResourceType.s3;
  }

  public async upload(path: string, stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.putObject(
        {
          Bucket: this.bucket,
          Key: path,
          Body: stream,
        },
        (err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data.ETag || '');
        },
      );
    });
  }

  public async start(): Promise<void> {}

  public async stop(): Promise<void> {}
}
