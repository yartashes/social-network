/* eslint-disable @typescript-eslint/indent,indent */
import { PostgresResource } from '../../resources/postgresql';

import { Users } from '../interfaces';
import { BaseRepository } from '../base';

import { CreateParams } from './interfaces';

export class PostgresUsersRepository
  extends BaseRepository<PostgresResource>
  implements Users {
  public async create(params: CreateParams): Promise<bigint> {
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
}
