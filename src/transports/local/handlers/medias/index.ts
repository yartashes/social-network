import { ServiceTypes } from '../../../../libraries/constants/service-types';

import { Image } from '../../../../domains/image';

import { LocalBaseHandler } from '../base';

export class MediasHandler extends LocalBaseHandler {
  public get service(): ServiceTypes {
    return ServiceTypes.medias;
  }

  public async getImageByIds(request: Array<string>): Promise<Array<Image>> {
    return this.services
      .media
      .getImageByIds(request);
  }
}
