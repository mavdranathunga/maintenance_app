export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

export class AppError extends Error {
  public code: ErrorCode;
  public details?: any;

  constructor(code: ErrorCode, message: string, details?: any) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }

  toJSON(): ErrorResponse {
    return {
      ok: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function createUnauthorizedError(message = "Unauthorized") {
  return new AppError(ErrorCode.UNAUTHORIZED, message);
}

export function createForbiddenError(message = "Forbidden") {
  return new AppError(ErrorCode.FORBIDDEN, message);
}

export function createNotFoundError(message = "Resource not found") {
  return new AppError(ErrorCode.NOT_FOUND, message);
}

export function createValidationError(message = "Validation failed", details?: any) {
  return new AppError(ErrorCode.VALIDATION_ERROR, message, details);
}

export function createBadRequestError(message = "Bad request") {
  return new AppError(ErrorCode.BAD_REQUEST, message);
}
