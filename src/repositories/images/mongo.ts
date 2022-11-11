/* eslint-disable @typescript-eslint/indent,indent */
import { ObjectId } from 'bson';

import {
  Image as ImageDomain,
  ImageSizes,
  ImageType as DomainImageType,
} from '../../domains/image';

import { Images } from '../interfaces';

import { MongoBaseRepository } from '../mongo-base';

import {
  ImageCreateParams,
  ImageType,
  Image,
} from './interfaces';

export class MongoImagesRepository
  extends MongoBaseRepository<Image>
  implements Images {
  protected get collectionName(): string {
    return 'images';
  }

  public async create(params: ImageCreateParams): Promise<string> {
    this.log.debug({ params }, 'create images');
    const now = new Date();

    const result = await this.collection
      .insertOne({
        _id: new ObjectId(),
        author: params.author,
        name: params.name,
        types: this.db
          .serialize<Record<ImageSizes, DomainImageType>, Record<string, ImageType>>(params.types),
        created_at: now,
        updated_at: now,
      });

    return result.insertedId.toString();
  }

  public async getByIds(ids: Array<string>): Promise<Array<ImageDomain>> {
    this.log.debug({ ids }, 'get images by ids');

    const result = await this.collection
      .find({
        _id: {
          $in: ids.map((id) => new ObjectId(id)),
        },
        deleted_at: {
          $exists: false,
        },
      })
      .toArray();

    return result.map((image) => this.mapper(image));
  }

  private mapper(raw: Image): ImageDomain {
    return this.db.deserialize<Image, ImageDomain>(raw);
  }
}
