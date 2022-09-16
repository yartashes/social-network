import { Auth, Params, ServicesType } from './interfaces';
import { AuthService } from './auth';

export class Services {
  private readonly services: ServicesType;

  constructor(params: Params) {
    this.services = {
      auth: new AuthService(params),
    };
  }

  public get auth(): Auth {
    return this.services.auth;
  }
}
