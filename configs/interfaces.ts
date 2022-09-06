export interface TransportsHttpConfig {
  port: number;
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

export interface Config {
  transports: TransportsConfig;
  logger: LoggerConfig;
}
