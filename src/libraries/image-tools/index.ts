import sharp from 'sharp';

import { ImageInfoResult, ResizeParams } from './interfaces';

export class ImageTools {
  public async resize(params: ResizeParams): Promise<void> {
    await sharp(params.input)
      .resize({
        fit: params.fit,
        height: params.height,
        width: params.width,
        position: params.position,
      })
      .toFormat('png')
      .toFile(params.output);
  }

  public async info(file: string): Promise<ImageInfoResult> {
    const metadata = await sharp(file).metadata();

    return {
      height: metadata.height,
      width: metadata.width,
      orientation: metadata.orientation,
      size: metadata.size,
    };
  }
}
