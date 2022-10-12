import {
  Auth,
  Media,
  Params,
  ServicesType,
  Users,
} from './interfaces';
import { AuthService } from './auth';
import { UsersService } from './users';
import { MediaService } from './media';

export class Services {
  private readonly services: ServicesType;

  constructor(params: Params) {
    this.services = {
      auth: new AuthService(params),
      users: new UsersService(params),
      media: new MediaService(params),
    };
  }

  public get auth(): Auth {
    return this.services.auth;
  }

  public get users(): Users {
    return this.services.users;
  }

  public get media(): Media {
    return this.services.media;
  }
}
