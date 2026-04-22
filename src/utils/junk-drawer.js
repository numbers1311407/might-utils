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
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export const toRomanNumeral = (num) => {
  const lookup = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];
  return lookup.reduce((acc, [k, v]) => {
    acc += k.repeat(Math.floor(num / v));
    num %= v;
    return acc;
  }, "");
};

export const isPrimitive = (val) => val !== Object(val);

export const isCloneable = (val) => {
  try {
    structuredClone(val);
    return true;
  } catch {
    return false;
  }
};

export const initDict = (keys, value, keyFn) => {
  const isFn = typeof value === "function";

  if (!isFn && !isPrimitive(value) && !isCloneable(value)) {
    throw new TypeError(
      "Value must be a primitive, structured-cloneable, or a function returning a value.",
    );
  }

  const dict = {};
  const getKey = typeof keyFn === "function" ? keyFn : (key) => key;
  const getValue = isFn
    ? value
    : typeof value === "object" && value !== null
      ? () => structuredClone(value)
      : () => value;

  keys.forEach((key, i) => {
    dict[getKey(key)] = getValue(key, i);
  });

  return dict;
};

export const sum = (arr) => arr.reduce((sum, k) => k + sum, 0);

export const round = (n, place = 2) => {
  const nths = Math.pow(10, place);
  return Math.round(n * nths) / nths;
};

export const identity = (v) => v;

export const debounce = (func, wait = 250) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const intersection = (arr1, arr2) => {
  return [...new Set(arr1).intersection(new Set(arr2))];
};

export const pick = (object, ...attrs) => {
  const picked = {};
  for (const attr of attrs) {
    if (attr in object) {
      picked[attr] = object[attr];
    }
  }
  return picked;
};

export const standardDeviation = (array, { usePopulation = true } = {}) => {
  const n = array.length;
  if (n < 2 && !usePopulation) return 0;

  const mean = array.reduce((a, b) => a + b) / n;
  const variance =
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
    (n - (usePopulation ? 0 : 1));
  return Math.sqrt(variance);
};
