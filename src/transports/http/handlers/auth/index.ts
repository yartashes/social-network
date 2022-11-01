import { NextFunction, Response as ExpressResponse } from 'express';

import {
  ExchangeParams,
  SignInParams,
  SignInVerifyParams,
  SignupParams,
  SignupVerifyParams,
} from '../../../../services/auth/interfaces';

import { ServiceTypes } from '../../../../libraries/constants/service-types';

import { Request } from '../../interfaces';

import { HttpBaseHandler } from '../base';

import {
  exchangeRequest,
  signInRequest,
  signInVerifyRequest,
  signupRequest,
  signupVerifyRequest,
} from './constants';
import {
  ExchangeResponse,
  SignInResponse,
  SignInVerifyResponse,
  SignupResponse,
  SignupVerifyResponse,
} from './interfaces';

export class AuthHandler extends HttpBaseHandler {
  public get service(): ServiceTypes {
    return ServiceTypes.auth;
  }

  public async signupVerify(
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

  public async signup(
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

  public async signIn(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      const params: SignInParams = {
        email: req.body.email,
      };

      const validation = signInRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const result = await this
        .services
        .auth
        .signIn(params);

      const response: SignInResponse = {
        result,
      };

      return res.json(response);
    } catch (e) {
      next(e);
    }

    return undefined;
  }

  public async signInVerify(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      const params: SignInVerifyParams = {
        code: req.body.code,
      };

      const validation = signInVerifyRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const result = await this
        .services
        .auth
        .signInVerify(params);

      const response: SignInVerifyResponse = {
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

  public async exchange(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      const params: ExchangeParams = {
        token: req.body.token,
      };

      const validation = exchangeRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const result = await this
        .services
        .auth
        .exchange(params);

      const response: ExchangeResponse = {
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
}
