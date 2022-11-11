/* eslint-disable @typescript-eslint/indent,indent */
import { ObjectId } from 'bson';

import {
  Post as PostDomain,
} from '../../domains/post';

import { Posts } from '../interfaces';

import { MongoBaseRepository } from '../mongo-base';

import { Post, PostCreateParams } from './interfaces';

export class MongoPostsRepository
  extends MongoBaseRepository<Post>
  implements Posts {
  protected get collectionName(): string {
    return 'posts';
  }

  public async create(params: PostCreateParams): Promise<string> {
    this.log.debug({ params }, 'create post');
    const now = new Date();
    const doc: Post = {
      _id: new ObjectId(),
      author: params.author,
      title: params.title,
      created_at: now,
      updated_at: now,
    };

    if (params.text) {
      doc.text = params.text;
    }

    if (params.images) {
      doc.images = params.images.map((id) => new ObjectId(id));
    }

    const result = await this.collection
      .insertOne(doc);

    return result.insertedId.toString();
  }

  private mapper(raw: Post): PostDomain {
    return this.db.deserialize<Post, PostDomain>(raw);
  }
}
