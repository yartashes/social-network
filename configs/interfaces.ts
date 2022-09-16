export interface TransportsHttpConfig {
  port: number;
  host: string;
}

export interface TransportsConfig {
  http: TransportsHttpConfig;
}

export interface LoggerConfig {
  levels: Record<string, string>;
  prettry: boolean;
  sentry: {
    dsn: string;
  };
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
}

export interface Config {
  transports: TransportsConfig;
  logger: LoggerConfig;
  resources: ResourcesConfig;
}
