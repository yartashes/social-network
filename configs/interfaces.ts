export interface TransportHttpConfig {
  port: number;
  host: string;
}

export interface TransportKafkaMigrationConfig {
  version: string;
}

export interface TransportKafkaConfig {
  brokers: string;
  id: string;
  replication: number;
  migration: TransportKafkaMigrationConfig;
}

export interface TransportsConfig {
  http: TransportHttpConfig;
  kafka: TransportKafkaConfig;
}

export interface LoggerConfig {
  levels: Record<string, string>;
  prettry: boolean;
  sentry: {
    dsn: string;
  };
}

export interface MongoReplicaSetConfig {
  name: string;
}

export interface MongoAuthConfig {
  user: string;
  password: string;
}

export interface ResourceMongoConfig {
  hosts: string;
  db: string;
  rs: MongoReplicaSetConfig;
  auth: MongoAuthConfig;
}

export interface ResourceS3Config {
  host: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export interface ResourcePostgresConfig {
  host: string;
  port: number;
  db: string;
  user: string;
  password: string;
}

export interface ResourceRedisConfig {
  host: string;
  port: number;
  db: number;
}

export interface ResourceMailjetConfig {
  public: string;
  private: string;
}

export interface ResourcesConfig {
  postgres: ResourcePostgresConfig;
  mailjet: ResourceMailjetConfig;
  redis: ResourceRedisConfig;
  mongo: ResourceMongoConfig;
  s3: ResourceS3Config;
}

export interface AppJwtExpireConfig {
  access: string;
  refresh: string;
}

export interface AppJwtConfig {
  secret: string;
  expire: AppJwtExpireConfig;
  algorithm: string;
}

export interface AppConfig {
  jwt: AppJwtConfig;
}

export interface Config {
  app: AppConfig;
  transports: TransportsConfig;
  logger: LoggerConfig;
  resources: ResourcesConfig;
}
