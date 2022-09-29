import Joi, { ObjectSchema } from 'joi';

import {
  SignInParams,
  SignupParams,
  SignupVerifyParams,
  SignInVerifyParams, ExchangeParams,
} from '../../../../services/auth/interfaces';

export const signupRequest: ObjectSchema<SignupParams> = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(5).max(35)
    .required(),
});

export const signupVerifyRequest: ObjectSchema<SignupVerifyParams> = Joi.object({
  code: Joi.number()
    .min(100000)
    .max(999999)
    .required()
    .integer(),
});

export const signInRequest: ObjectSchema<SignInParams> = Joi.object({
  email: Joi.string().email().required(),
});

export const signInVerifyRequest: ObjectSchema<SignInVerifyParams> = Joi.object({
  code: Joi.number()
    .min(100000)
    .max(999999)
    .required()
    .integer(),
});

export const exchangeRequest: ObjectSchema<ExchangeParams> = Joi.object({
  token: Joi.string().required(),
});
