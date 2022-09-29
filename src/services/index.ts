import {
  Auth,
  Params,
  ServicesType,
  Users,
} from './interfaces';
import { AuthService } from './auth';
import { UsersService } from './users';

export class Services {
  private readonly services: ServicesType;

  constructor(params: Params) {
    this.services = {
      auth: new AuthService(params),
      users: new UsersService(params),
    };
  }

  public get auth(): Auth {
    return this.services.auth;
  }

  public get users(): Users {
    return this.services.users;
  }
}
