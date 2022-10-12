import { S3 } from 'aws-sdk';

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

  public async upload(): Promise<void> {

  }

  public async start(): Promise<void> {
    // this.client.putObject(
    //   { Bucket: this.bucket, Key: 'testobject', Body: 'Hello from MinIO!!' },
    //   (err, data) => {
    //     if (err) console.log(err);
    //     else console.log('Successfully uploaded data to testbucket/testobject', data);
    //   },
    // );
  }

  public async stop(): Promise<void> {}
}
