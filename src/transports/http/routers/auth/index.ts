import { Logger as PinoLogger } from 'pino';
import {
  NextFunction,
  Response as ExpressResponse,
  Router,
} from 'express';
import Joi from 'joi';

import { Logger } from '../../../../libraries/logger';

import { Services } from '../../../../services';

import { Request } from '../../interfaces';

import { HttpRouter } from '../interfaces';
import { SignupParams, SignupVerifyParams } from '../../../../services/auth/interfaces';
import { SignupResponse, SignupVerifyResponse } from './interfaces';
import { signupRequest, signupVerifyRequest } from './constants';

export class AuthRouter implements HttpRouter {
  private readonly log: PinoLogger;

  private readonly services: Services;

  constructor(services: Services, logger: Logger) {
    this.services = services;

    this.log = logger.getLogger('http-auth-router');
  }

  public get path(): string {
    return '/api/auth';
  }

  public init(): Router {
    this.log.info('Auth router init');
    const router = Router();

    router
      .post(
        '/signup',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.signup(newReq, res, next);
        },
      )
      .post(
        '/signup/verify',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.signupVerify(newReq, res, next);
        },
      );

    return router;
  }

  private async signupVerify(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      const params: SignupVerifyParams = {
        code: req.body.code,
      };

      const validation = signupVerifyRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const result = await this
        .services
        .auth
        .signupVerify(params);

      const response: SignupVerifyResponse = {
        result: {
          access: result.access,
          refresh: result.refresh,
        },
      };

      return res.json(response);
    } catch (e) {
      next(e);
    }

    return undefined;
  }

  private async signup(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      const params: SignupParams = {
        email: req.body.email,
        username: req.body.username,
      };

      const validation = signupRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const result = await this
        .services
        .auth
        .signup(params);

      const response: SignupResponse = {
        result,
      };

      return res.json(response);
    } catch (e) {
      next(e);
    }

    return undefined;
  }
}
