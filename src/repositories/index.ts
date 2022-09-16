import { Logger } from '../libraries/logger';
import { Resources } from '../resources';
import { Users, RepositoriesType } from './interfaces';
import { PostgresUsersRepository } from './users/postgres';

export class Repositories {
  private readonly repositories: RepositoriesType;

  constructor(resources: Resources, logger: Logger) {
    this.repositories = {
      users: new PostgresUsersRepository(
        resources.postgres,
        logger,
      ),
    };
  }

  public get users(): Users {
    return this.repositories.users;
  }
}
