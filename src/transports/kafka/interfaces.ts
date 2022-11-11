import { LogEntry } from 'kafkajs';

export type LoggerFunction = (entry: LogEntry) => void;
