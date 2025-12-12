export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(message = "Insufficient credits") {
    super(402, message);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database error occurred") {
    super(500, message);
  }
}
