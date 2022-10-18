import { ImageSize } from './interfaces';
import { ImageSizes } from '../../domains/image';
import { FitType, Positions } from '../../libraries/image-tools/interfaces';

export const imageSizes = new Array<ImageSize>(
  {
    size: ImageSizes.original,
  },
  {
    size: ImageSizes.medium,
    params: {
      position: Positions.leftTop,
      fit: FitType.cover,
      width: 400,
      height: 300,
    },
  },
  {
    size: ImageSizes.small,
    params: {
      position: Positions.centre,
      fit: FitType.inside,
      height: 100,
      width: 100,
    },
  },
);
