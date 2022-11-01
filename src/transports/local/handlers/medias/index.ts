import { ServiceTypes } from '../../../../libraries/constants/service-types';

import { LocalBaseHandler } from '../base';

export class MediasHandler extends LocalBaseHandler {
  public get service(): ServiceTypes {
    return ServiceTypes.medias;
  }
}
