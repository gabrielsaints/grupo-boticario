class RequestError extends Error {
  public static fromError(status: number, err: Error) {
    const e = err as RequestError;
    e.status = status;
    return e;
  }

  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isRequestError(err: RequestError | any): err is RequestError {
  if (err instanceof RequestError) {
    return true;
  }

  if (err instanceof Error) {
    if (
      (err as RequestError).status !== undefined &&
      typeof (err as RequestError).status === 'number'
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

export { isRequestError };

export default RequestError;
