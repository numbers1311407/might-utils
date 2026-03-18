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

export const capitalize = (str = "") => {
  if (!str.length) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatSortedNumbers = (nums) => {
  if (!nums || nums.length === 0) return "";

  const result = [];
  let start = nums[0];

  for (let i = 0; i < nums.length; i++) {
    if (i === nums.length - 1 || nums[i + 1] !== nums[i] + 1) {
      const end = nums[i];

      if (start === end) {
        result.push(`${start}`);
      } else {
        result.push(`${start}-${end}`);
      }

      if (i < nums.length - 1) {
        start = nums[i + 1];
      }
    }
  }

  return result.join(", ");
};
