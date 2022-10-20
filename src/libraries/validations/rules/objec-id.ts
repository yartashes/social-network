import Joi, { CustomHelpers, Schema } from 'joi';

import { BaseValidator } from '../base';

import { ValidationFailResult } from '../interfaces';

export class ObjectId extends BaseValidator {
  public get type(): string {
    return 'objectId';
  }

  public get base(): Schema {
    return Joi.string();
  }

  public get messages(): Record<string, string> {
    return {
      'objectId.base': '{{#label}} must be valid objectId',
    };
  }

  public validate(value: string, helpers: CustomHelpers): ValidationFailResult | undefined {
    if (!/^[0-9|a-f|A-F]{24}$/.test(value)) {
      return {
        value,
        error: helpers.error('objectId.base'),
      };
    }

    return undefined;
  }
}
