import {
  Auth,
  Media,
  Params,
  ServicesType,
  Users,
  Posts,
} from './interfaces';
import { AuthService } from './auth';
import { UsersService } from './users';
import { MediaService } from './media';
import { PostsService } from './posts';

export class Services {
  private readonly services: ServicesType;

  constructor(params: Params) {
    this.services = {
      auth: new AuthService(params),
      users: new UsersService(params),
      media: new MediaService(params),
      posts: new PostsService(params),
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

  public get posts(): Posts {
    return this.services.posts;
  }
}
