/* eslint-disable @typescript-eslint/indent,indent */
import { PostgresResource } from '../../resources/postgresql';

import { Users } from '../interfaces';
import { BaseRepository } from '../base';

import { UserCreateParams, User } from './interfaces';
import { User as UserDomain } from '../../domains/user';

export class PostgresUsersRepository
  extends BaseRepository<PostgresResource>
  implements Users {
  public async create(params: UserCreateParams): Promise<bigint> {
    this.log.debug({ params }, 'create user');
    const result = await this.db
      .getClient()
      .query<{ id: bigint }>(
      `
          INSERT INTO t_users (email, username)
          VALUES ($1, $2)
          RETURNING id;
        `,
        [
          params.email,
          params.username,
        ],
      );

    if (result.rows.length === 0) {
      return 0n;
    }

    return result.rows[0].id;
  }

  public async getByEmail(email: string): Promise<UserDomain | undefined> {
    this.log.debug({ email }, 'get user by email');
    const result = await this.db
      .getClient()
      .query<User>(
      `
          SELECT *
          FROM t_users
          WHERE email = $1 AND deleted_at IS NULL;
      `,
        [
          email,
        ],
      );

    if (result.rows.length === 0) {
      return undefined;
    }

    return PostgresUsersRepository.mapper(result.rows[0]);
  }

  public async getByIdWithDeleted(id: bigint): Promise<UserDomain | undefined> {
    this.log.debug({ id }, 'get user by id');
    const result = await this.db
      .getClient()
      .query<User>(
      `
          SELECT *
          FROM t_users
          WHERE id = $1;
      `,
        [
          id,
        ],
      );

    if (result.rows.length === 0) {
      return undefined;
    }

    return PostgresUsersRepository.mapper(result.rows[0]);
  }

  public async getById(id: bigint): Promise<UserDomain | undefined> {
    this.log.debug({ id }, 'get user by id');
    const result = await this.db
      .getClient()
      .query<User>(
      `
          SELECT *
          FROM t_users
          WHERE id = $1 AND deleted_at IS NULL;
      `,
        [
          id,
        ],
      );

    if (result.rows.length === 0) {
      return undefined;
    }

    return PostgresUsersRepository.mapper(result.rows[0]);
  }

  private static mapper(raw: User): UserDomain {
    const result: UserDomain = {
      email: raw.email,
      username: raw.username,
      id: raw.id,
      updatedAt: raw.updated_at,
      createdAt: raw.created_at,
    };

    if (raw.deleted_at) {
      result.deletedAt = raw.deleted_at;
    }

    return result;
  }
}
