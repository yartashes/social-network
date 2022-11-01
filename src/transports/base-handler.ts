import { ServiceTypes } from '../libraries/constants/service-types';

import { Services } from '../services';

import { Handler } from './interfaces';

export class BaseHandler implements Handler {
  protected readonly services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  public get service(): ServiceTypes {
    throw new Error('Handler service getter not implemented');
  }
}
