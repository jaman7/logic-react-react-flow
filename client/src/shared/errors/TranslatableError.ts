export class TranslatableError extends Error {
  key: string;
  values?: Record<string, any>;

  constructor(key: string, values?: Record<string, any>) {
    super(key);
    this.name = 'TranslatableError';
    this.key = key;
    this.values = values;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TranslatableError);
    }
  }
}
