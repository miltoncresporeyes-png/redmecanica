
export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
      super(message, 404);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
      super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
      super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}
