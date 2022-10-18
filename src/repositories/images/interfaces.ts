import { Document, ObjectId } from 'bson';

import { ImageSizes, ImageType as DomainImageType } from '../../domains/image';

export interface ImageType extends Document {
  path: string;
  height: number;
  weight: number;
  size: number;
}

export interface Image extends Document {
  _id: ObjectId;
  types: Record<string, ImageType>;
  author: bigint;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ImageCreateParams {
  types: Record<ImageSizes, DomainImageType>;
  name: string;
  author: bigint;
}
