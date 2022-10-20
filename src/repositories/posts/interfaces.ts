import { Document, ObjectId } from 'bson';

export interface Post extends Document {
  _id: ObjectId;
  images?: Array<ObjectId>;
  author: bigint;
  text?: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface PostCreateParams {
  author: bigint;
  title: string;
  images?: Array<string>;
  text?: string;
}
