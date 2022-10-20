import { ObjectSchema } from 'joi';

import validator from '../../../../libraries/validations';

import {
  SignInParams,
  SignupParams,
  SignupVerifyParams,
  SignInVerifyParams, ExchangeParams,
} from '../../../../services/auth/interfaces';

export const signupRequest: ObjectSchema<SignupParams> = validator.object({
  email: validator.string().email().required(),
  username: validator.string().alphanum().min(5).max(35)
    .required(),
});

export const signupVerifyRequest: ObjectSchema<SignupVerifyParams> = validator.object({
  code: validator.number()
    .min(100000)
    .max(999999)
    .required()
    .integer(),
});

export const signInRequest: ObjectSchema<SignInParams> = validator.object({
  email: validator.string().email().required(),
});

export const signInVerifyRequest: ObjectSchema<SignInVerifyParams> = validator.object({
  code: validator.number()
    .min(100000)
    .max(999999)
    .required()
    .integer(),
});

export const exchangeRequest: ObjectSchema<ExchangeParams> = validator.object({
  token: validator.string().required(),
});
