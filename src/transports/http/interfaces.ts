import { Request as ExpressRequest } from 'express';

import { User } from '../../domains/user';

export interface Request extends ExpressRequest {
  user: User;
}
