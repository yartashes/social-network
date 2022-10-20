import { ErrorReport } from 'joi';

export interface ValidationFailResult {
  value: unknown;
  error: ErrorReport;
}
