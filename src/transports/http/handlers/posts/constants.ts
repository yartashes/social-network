import { ObjectSchema } from 'joi';

import { PostCreateParams } from '../../../../services/posts/interfaces';

import validator from '../../../../libraries/validations';

export const createRequest: ObjectSchema<PostCreateParams> = validator.object({
  authorId: validator.number().required().positive(),
  images: validator.array().optional().items(
    validator.objectId(),
  ),
  title: validator.string().required().min(5).max(50),
  text: validator.string().optional().max(1000),
});
