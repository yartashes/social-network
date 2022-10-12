import { BaseService } from '../base';

import { Media } from '../interfaces';
import { UploadParams } from './interfaces';

export class MediaService extends BaseService implements Media {
  public async upload(params: UploadParams): Promise<string> {
    return '';
  }
}
