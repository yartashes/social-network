import {
  Services as ServicesInterface,
  Auth,
  Medias,
  Params,
  Users,
  Posts,
} from './interfaces';
import { AuthService } from './auth';
import { UsersService } from './users';
import { MediaService } from './medias';
import { PostsService } from './posts';

export class Services {
  private readonly services: ServicesInterface;

  constructor(params: Params) {
    this.services = {
      auth: new AuthService(params),
      users: new UsersService(params),
      medias: new MediaService(params),
      posts: new PostsService(params),
    };
  }

  public get auth(): Auth {
    return this.services.auth;
  }

  public get users(): Users {
    return this.services.users;
  }

  public get media(): Medias {
    return this.services.medias;
  }

  public get posts(): Posts {
    return this.services.posts;
  }
}
