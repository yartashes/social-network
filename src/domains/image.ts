export enum ImageSizes {
  original = 'original',
  medium = 'medium',
  small = 'small',
}

export interface ImageType {
  path: string;
  height: number;
  weight: number;
  size: number;
}

export interface Image {
  id?: string;
  types: Record<ImageSizes, ImageType>;
  author: bigint;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
