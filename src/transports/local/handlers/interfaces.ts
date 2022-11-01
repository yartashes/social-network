import { MediasHandler } from './medias';
import { UsersHandler } from './users';

export interface Handler {
  medias: MediasHandler;
  users: UsersHandler;
}
