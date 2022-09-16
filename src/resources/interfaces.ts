export interface Resource {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export enum ResourceType {
  postgres = 0,
  mail = 1,
  redis = 2,
}
