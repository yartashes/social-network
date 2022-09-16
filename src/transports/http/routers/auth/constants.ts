import Joi, { ObjectSchema } from 'joi';

import { SignupParams } from '../../../../services/auth/interfaces';

export const signupRequest: ObjectSchema<SignupParams> = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(5).max(35)
    .required(),
});
