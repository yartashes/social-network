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

export interface ResourcesConfig {
  postgres: ResourcePostgresConfig;
}

export interface Config {
  transports: TransportsConfig;
  logger: LoggerConfig;
  resources: ResourcesConfig;
}
