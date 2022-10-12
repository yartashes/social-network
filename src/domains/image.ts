export enum ImageTypes {
  original = 'original',
  medium = 'medium',
  small = 'small',
}

export interface ImageType {
  url: string;
  height: number;
  weight: number;
  size: number;
}

export interface Image {
  id?: string;
  sizes: Record<ImageTypes, ImageType>;
  author: bigint;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
