import { Document } from 'bson';
import { Collection } from 'mongodb';

import { MongoResource } from '../resources/mongo';

import { BaseRepository } from './base';

export class MongoBaseRepository<D extends Document> extends BaseRepository<MongoResource> {
  protected get collectionName(): string {
    throw new Error('Not implemented');
  }

  protected get collection(): Collection<D> {
    return this.db.getClient().collection(this.collectionName);
  }
}
