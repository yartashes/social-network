import { Schema } from 'convict';
import { Config } from './interfaces';

export const configSchema: Schema<Config> = {
  app: {
    jwt: {
      secret: {
        default: '',
        format: String,
        nullable: false,
        env: 'JWT_SECRET',
      },
      algorithm: {
        default: 'HS512',
        format: String,
        env: 'JWT_ALGORITHM',
      },
      expire: {
        access: {
          default: '10m',
          format: String,
          env: 'JWT_EXPIRE_ACCESS',
        },
        refresh: {
          default: '10d',
          format: String,
          env: 'JWT_EXPIRE_REFRESH',
        },
      },
    },
  },
  transports: {
    http: {
      port: {
        default: 3456,
        env: 'TRANSPORTS_HTTP_PORT',
        format: 'port',
      },
      host: {
        default: '127.0.0.1',
        env: 'TRANSPORTS_HTTP_HOST',
      },
    },
    kafka: {
      id: {
        default: 'social-network',
        env: 'TRANSPORTS_KAFKA_REPLICATION',
        format: String,
      },
      replication: {
        default: 1,
        env: 'TRANSPORTS_KAFKA_REPLICATION',
        format: 'int',
      },
      brokers: {
        default: '',
        env: 'TRANSPORTS_KAFKA_BROKERS',
        format: String,
      },
      migration: {
        version: {
          default: '',
          env: 'TRANSPORTS_KAFKA_MIGRATION',
          format: String,
        },
      },
    },
  },
  logger: {
    levels: {},
    prettry: {
      default: true,
      env: 'LOGGER_PRETTRY',
    },
    sentry: {
      dsn: {
        env: 'LOGGER_SENTRY_DSN',
        default: null,
      },
    },
  },
  resources: {
    postgres: {
      host: {
        default: '127.0.0.1',
        env: 'PG_HOST',
      },
      port: {
        default: 5432,
        env: 'PG_PORT',
        format: 'port',
      },
      db: {
        default: 'social_networks',
        env: 'PG_DB',
      },
      user: {
        default: '',
        env: 'PG_USER',
        nullable: false,
      },
      password: {
        default: '',
        env: 'PG_PASS',
        nullable: false,
      },
    },
    mailjet: {
      public: {
        default: '',
        format: String,
        nullable: false,
        env: 'MAILJET_KEY',
      },
      private: {
        default: '',
        format: String,
        nullable: false,
        env: 'MAILJET_SECRET',
      },
    },
    redis: {
      host: {
        default: '127.0.0.1',
        format: String,
        env: 'REDIS_HOST',
      },
      port: {
        default: 6379,
        format: 'port',
        env: 'REDIS_PORT',
      },
      db: {
        default: 0,
        format: Number,
        env: 'REDIS_DB',
      },
    },
    mongo: {
      hosts: {
        default: '',
        env: 'MONGO_HOSTS',
        nullable: false,
        format: String,
      },
      db: {
        default: 'posts',
        env: 'MONGO_DB',
        nullable: false,
        format: String,
      },
      rs: {
        name: {
          default: 'sn',
          env: 'MONGO_RS_NAME',
          nullable: false,
          format: String,
        },
      },
      auth: {
        user: {
          default: '',
          env: 'MONGO_USER',
          nullable: false,
          format: String,
        },
        password: {
          default: '',
          env: 'MONGO_PASS',
          nullable: false,
          format: String,
        },
      },
    },
    s3: {
      host: {
        default: '127.0.0.1:9000',
        env: 'S#_HOST',
        nullable: false,
        format: String,
      },
      accessKeyId: {
        default: '',
        env: 'S3_ACCESS',
        nullable: false,
        format: String,
      },
      secretAccessKey: {
        default: '',
        env: 'S3_SECRET',
        nullable: false,
        format: String,
      },
      bucket: {
        default: '',
        env: 'S3_Bucket',
        nullable: false,
        format: String,
      },
    },
  },
};
