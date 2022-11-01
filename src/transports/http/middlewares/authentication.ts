/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
import { Logger as PinoLogger } from 'pino';
import { NextFunction, Response } from 'express';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Logger } from '../../../libraries/logger';
import { ClientError } from '../../../libraries/errors/client';
import { HttpStatusCodes } from '../../../libraries/constants/http-status-codes';
import { Jwt } from '../../../libraries/jwt';

import { Auth } from '../../../services/interfaces';

import { Request } from '../interfaces';

import { MiddlewareHandler } from './interface';
import { TokenType } from '../../../libraries/jwt/interfaces';

export class AuthenticationMiddleware implements MiddlewareHandler {
  private readonly logger: PinoLogger;

  private readonly jwt: Jwt;

  private readonly authService: Auth;

  constructor(
    auth: Auth,
    jwt: Jwt,
    logger: Logger,
  ) {
    this.logger = logger.getLogger('authentication-middleware');
    this.jwt = jwt;
    this.authService = auth;
  }

  public get endpointWhiteList(): Array<string> {
    return [
      '/api/auth',
      '/docs/swagger',
    ];
  }

  public async handler(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (this.endpointWhiteList.some((url) => req.path.startsWith(url))) {
      return next();
    }

    const header = req.header('Authorization');

    if (!header) {
      return next(
        new ClientError(
          'Authorization header is required',
          HttpStatusCodes.badRequest,
        ),
      );
    }
    const [, token] = header.split(' ');

    try {
      const payload = await this.jwt.decode(token);

      if (payload.type !== TokenType.access) {
        return next(
          new ClientError(
            'Incorrect Jwt type',
            HttpStatusCodes.forbidden,
          ),
        );
      }

      req.user = await this.authService.getUserById(payload.id);
    } catch (e) {
      switch (true) {
      case e instanceof TokenExpiredError:
        return next(
          new ClientError(
            'Jwt token expired',
            HttpStatusCodes.unauthorized,
          ),
        );
      case e instanceof JsonWebTokenError:
        return next(
          new ClientError(
            'Invalid jwt token',
            HttpStatusCodes.forbidden,
          ),
        );
      default:
        break;
      }

      this.logger.warn(e);
    }

    return next();
  }
}
