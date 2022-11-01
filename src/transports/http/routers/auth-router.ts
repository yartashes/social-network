import { Router } from 'express';

import { Request } from '../interfaces';

import { HttpRouter } from './interfaces';
import { BaseRouter } from './base';

export class AuthRouter extends BaseRouter implements HttpRouter {
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

          return this.handlers.auth.signup(newReq, res, next);
        },
      )
      .post(
        '/signup/verify',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.handlers.auth.signupVerify(newReq, res, next);
        },
      )
      .post(
        '/signin',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.handlers.auth.signIn(newReq, res, next);
        },
      )
      .post(
        '/signin/verify',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.handlers.auth.signInVerify(newReq, res, next);
        },
      )
      .post(
        '/exchange',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.handlers.auth.exchange(newReq, res, next);
        },
      );

    return router;
  }
}
