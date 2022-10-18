import { Readable } from 'stream';

export interface Storage {
  upload(path: string, stream: Readable): Promise<string>;
}
