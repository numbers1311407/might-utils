export class FindPartiesError extends Error {
  constructor(message, code, meta) {
    super(message);
    this.name = "FindPartiesError";
    this.code = code || "ERROR";
    this.meta = meta;
  }

  toJSON() {
    return {
      __type: "FindPartiesError",
      message: this.message,
      code: this.code,
      meta: this.meta,
      stack: this.stack,
    };
  }
}

FindPartiesError.fromJSON = (err) => {
  const error = new FindPartiesError(err.message, err.code, err.meta);
  error.stack = err.stack;
  return error;
};
