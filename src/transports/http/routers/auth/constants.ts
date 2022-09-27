import Joi, { ObjectSchema } from 'joi';

import { SignupParams } from '../../../../services/auth/interfaces';

export const signupRequest: ObjectSchema<SignupParams> = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(5).max(35)
    .required(),
});

export const signupVerifyRequest: ObjectSchema<SignupParams> = Joi.object({
  code: Joi.number()
    .min(100000)
    .max(999999)
    .required()
    .integer(),
});
