export interface Resource {
  start(): Promise<void>;
  stop(): Promise<void>;
}
