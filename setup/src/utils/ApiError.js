class ApiError extends Error {
  // constructor(message, status) {
  //   super(message);
  //   this.name = 'ApiError';
  //   this.status = status;
  // }
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.name = 'ApiError';
    this.data = null,
      this.status = statusCode;
    this.errors = errors;
    this.message = message

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError;