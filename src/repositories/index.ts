import { Logger } from '../libraries/logger';
import { Resources } from '../resources';
import {
  Users,
  RepositoriesType,
  Auth,
  Images,
  Posts,
} from './interfaces';
import { PostgresUsersRepository } from './users/postgres';
import { IoRedisAuthRepository } from './auth/redis';
import { MongoImagesRepository } from './images/mongo';
import { MongoPostsRepository } from './posts/mongo';

export class Repositories {
  private readonly repositories: RepositoriesType;

  constructor(resources: Resources, logger: Logger) {
    this.repositories = {
      users: new PostgresUsersRepository(
        resources.postgres,
        logger,
      ),
      auth: new IoRedisAuthRepository(resources.redis, logger),
      images: new MongoImagesRepository(resources.mongo, logger),
      posts: new MongoPostsRepository(resources.mongo, logger),
    };
  }

  public get users(): Users {
    return this.repositories.users;
  }

  public get auth(): Auth {
    return this.repositories.auth;
  }

  public get images(): Images {
    return this.repositories.images;
  }

  public get posts(): Posts {
    return this.repositories.posts;
  }
}
