import { Logger } from '../libraries/logger';
import { Resources } from '../resources';
import { Users, RepositoriesType, Auth } from './interfaces';
import { PostgresUsersRepository } from './users/postgres';
import { IoRedisAuthRepository } from './auth/redis';

export class Repositories {
  private readonly repositories: RepositoriesType;

  constructor(resources: Resources, logger: Logger) {
    this.repositories = {
      users: new PostgresUsersRepository(
        resources.postgres,
        logger,
      ),
      auth: new IoRedisAuthRepository(resources.redis, logger),
    };
  }

  public get users(): Users {
    return this.repositories.users;
  }

  public get auth(): Auth {
    return this.repositories.auth;
  }
}
