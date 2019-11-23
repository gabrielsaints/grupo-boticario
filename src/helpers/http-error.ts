class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isHttpError(err: HttpError | any): err is HttpError {
  if (err instanceof HttpError) {
    return true;
  }

  if (err instanceof Error) {
    if (
      (err as HttpError).status !== undefined &&
      typeof (err as HttpError).status === 'number'
    ) {
      return true;
    }
  }

  if (
    err.status !== undefined &&
    typeof err.status === 'number' &&
    err.message !== undefined &&
    typeof err.message === 'string'
  ) {
    return true;
  }

  return false;
}

export { isHttpError };

export default HttpError;
