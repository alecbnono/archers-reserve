export class AppError extends Error {
    status;
    isOperational;
    constructor(message, status) {
        super(message);
        this.status = status || 500;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
