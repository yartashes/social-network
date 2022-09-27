import jwt, { Algorithm } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { AppJwtConfig } from '../../../configs/interfaces';

import { Payload, Result, TokenType } from './interfaces';

export class Jwt {
  private readonly config: AppJwtConfig;

  constructor(config: AppJwtConfig) {
    this.config = config;
  }

  public async encode(userId: bigint): Promise<Result> {
    const payload: Payload = {
      id: userId,
      type: TokenType.access,
    };

    const access = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.config.secret,
        {
          algorithm: this.config.algorithm as Algorithm,
          expiresIn: this.config.expire.access,
          jwtid: uuidv4(),
        },
        (error, token) => {
          if (error) {
            reject(error);
          }

          if (token) {
            resolve(token);
          }
        },
      );
    });

    payload.type = TokenType.refresh;
    const refresh = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.config.secret,
        {
          algorithm: this.config.algorithm as Algorithm,
          expiresIn: this.config.expire.refresh,
          jwtid: uuidv4(),
        },
        (error, token) => {
          if (error) {
            reject(error);
          }

          if (token) {
            resolve(token);
          }
        },
      );
    });

    return {
      access,
      refresh,
    };
  }

  public async decode(token: string): Promise<Payload> {
    return new Promise<Payload>((resolve, reject) => {
      jwt.verify(
        token,
        this.config.secret,
        {
          algorithms: [
            this.config.algorithm as Algorithm,
          ],
        },
        (error, payload) => {
          if (error) {
            reject(error);
          }

          resolve(payload as Payload);
        },
      );
    });
  }
}
