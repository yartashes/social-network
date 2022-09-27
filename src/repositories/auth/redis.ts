/* eslint-disable @typescript-eslint/indent,indent */
import { RedisResource } from '../../resources/redis';

import { Auth } from '../interfaces';
import { BaseRepository } from '../base';

import { AuthInfo } from './interfaces';

export class IoRedisAuthRepository
  extends BaseRepository<RedisResource>
  implements Auth {
  public async getCode(code: number): Promise<AuthInfo | undefined> {
    const result = await this.db
      .getClient()
      .get(`auth:code:${code}`);

    if (!result) {
      return undefined;
    }

    return JSON.parse(result);
  }

  public async setCode(code: number, info: AuthInfo): Promise<boolean> {
    const result = await this.db
      .getClient()
      .set(
        `auth:code:${code}`,
        JSON.stringify(info),
        'EX',
        180,
      );

    return result === 'OK';
  }

  public async addRefreshToken(userId: bigint, token: string): Promise<boolean> {
    const result = await this.db
      .getClient()
      .set(
        `auth:tokens:refresh:${token}`,
        userId.toString(10),
        'EX',
        60 * 60 * 24 * 10,
      );

    return result === 'OK';
  }

  public async deleteRefreshToken(token: string): Promise<boolean> {
    const result = await this.db
      .getClient()
      .del(`auth:tokens:refresh:${token}`);

    return result > 0;
  }

  public async checkRefreshToken(token: string): Promise<boolean> {
    const result = await this.db.getClient().exists(`auth:tokens:refresh:${token}`);

    return result > 0;
  }
}
