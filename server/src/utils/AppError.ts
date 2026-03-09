export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(message: string, status?: number) {
    super(message);

    this.status = status || 500;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
