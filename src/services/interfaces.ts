import { Logger } from '../libraries/logger';
import { Repositories } from '../repositories';
import { Resources } from '../resources';

import { SignupParams } from './auth/interfaces';

export interface Params {
  logger: Logger;
  repositories: Repositories;
  resources: Resources;
}

export interface Auth {
  signup(params: SignupParams): Promise<boolean>;
}

export interface ServicesType {
  auth: Auth;
}
