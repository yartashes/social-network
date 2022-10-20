export interface PostCreateParams {
  title: string;
  authorId: bigint;
  images?: Array<string>;
  text?: string;
}
