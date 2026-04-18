export class FindPartiesError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "FindPartiesError";
    this.code = code || "ERROR";
  }

  toJSON() {
    return {
      __type: "FindPartiesError",
      message: this.message,
      code: this.code,
      stack: this.stack,
    };
  }
}

FindPartiesError.fromJSON = (err) => {
  const error = new FindPartiesError(err.message, err.code);
  error.stack = err.stack;
  return error;
};
