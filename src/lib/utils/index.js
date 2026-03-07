export const isEmpty = (value) => {
  if (value == null) return true;
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
};

export const isPlainObject = (value) => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor === Object
  );
};

export const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

export const countKeys = (keys = [], counts = {}) => {
  for (const key of keys) {
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
};

export const log = (message) => {
  if (typeof window !== "undefined") {
    console.log(message);
  } else {
    self.postMessage({
      type: "WORKER_LOG",
      data: typeof message === "object" ? JSON.stringify(message) : message,
    });
  }
};

export const getNumberedArray = (start, end) => {
  if (end === undefined) {
    end = start;
    start = 1;
  }
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};
