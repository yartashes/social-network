import { ImageSizes } from '../../domains/image';

import {
  FitType,
  Positions,
} from '../../libraries/image-tools/interfaces';

export interface UploadParams {
  name: string;
  path: string;
  authorId: bigint;
}

export interface ResizeParams {
  fit: FitType;
  position: Positions;
  width: number;
  height: number;
}

export interface ImageSize {
  size: ImageSizes,
  params?: ResizeParams
}

export interface Image {
  type: ImageSizes;
  path: string;
  width: number;
  height: number;
  size: number;
}
