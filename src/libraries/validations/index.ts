import Joi from 'joi';

import { ObjectId } from './rules/objec-id';

const validator = Joi.extend(
  new ObjectId(),
);

export = validator;
