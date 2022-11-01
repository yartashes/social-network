import { AuthHandler } from './auth';
import { MediasHandler } from './medias';
import { PostsHandler } from './posts';

export interface Handler {
  auth: AuthHandler;
  medias: MediasHandler;
  posts: PostsHandler;
}
