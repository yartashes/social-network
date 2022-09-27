import { Logger } from '../libraries/logger';
import { Repositories } from '../repositories';
import { Resources } from '../resources';
import { Jwt } from '../libraries/jwt';

import { SignupParams, SignupVerifyParams, SignupVerifyResult } from './auth/interfaces';

export interface Params {
  logger: Logger;
  repositories: Repositories;
  resources: Resources;
  jwt: Jwt;
}

export interface Auth {
  signup(params: SignupParams): Promise<boolean>;
  signupVerify(params: SignupVerifyParams): Promise<SignupVerifyResult>;
}

export interface ServicesType {
  auth: Auth;
}
