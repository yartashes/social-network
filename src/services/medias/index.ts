import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';

import {
  ImageSizes,
  ImageType,
  Image as ImageDomain,
} from '../../domains/image';

import { BaseService } from '../base';

import { Medias } from '../interfaces';

import { Image, UploadParams } from './interfaces';
import { imageSizes } from './constants';

export class MediaService extends BaseService implements Medias {
  // todo need refactor and add generic upload logic
  public async upload(params: UploadParams): Promise<string> {
    const storageResult = await Promise.all<Image>(
      imageSizes
        .map(async (item) => {
          const name = uuidv4();
          const filePath = `./tmp/upload/${name}`;
          const uploadFilePath = item.size === ImageSizes.original
            ? params.path
            : filePath;

          if (item.params !== undefined) {
            await this.imageTools.resize({
              input: params.path,
              output: filePath,
              width: item.params.width,
              height: item.params.height,
              fit: item.params.fit,
              position: item.params.position,
            });
          }

          const info = await this.imageTools.info(uploadFilePath);

          const stream = fs.createReadStream(
            uploadFilePath,
            {
              autoClose: true,
            },
          );

          const path = `${params.authorId}/${name}`;
          await this.resources
            .storage.upload(path, stream);

          await fs.promises.rm(
            uploadFilePath,
            {
              force: true,
              recursive: true,
            },
          );

          return {
            height: info.height || 0,
            width: info.width || 0,
            size: info.size || 0,
            type: item.size,
            path,
          };
        }),
    );

    const types: Partial<Record<ImageSizes, ImageType>> = {};
    storageResult.forEach((image) => {
      types[image.type] = {
        path: image.path,
        height: image.height,
        weight: image.width,
        size: image.size,
      };
    });

    return this.repositories
      .images
      .create({
        author: params.authorId,
        name: params.name,
        types: types as Record<ImageSizes, ImageType>,
      });
  }

  public async getImageByIds(ids: Array<string>): Promise<Array<ImageDomain>> {
    if (ids.length === 0) {
      return [];
    }

    return this.repositories
      .images
      .getByIds(ids);
  }
}
