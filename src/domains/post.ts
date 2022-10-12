export interface Post {
  id?: string;
  images?: Array<string>;
  author: bigint;
  text?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
