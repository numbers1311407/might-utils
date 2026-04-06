export const instrument = () => {
  const result = {};
  const time = () => performance.timeOrigin + performance.now();

  const self = {
    start: (key) => {
      result[key] = { start: time(), end: time() };
    },
    end: (key) => {
      result[key].end = time();
      result[key].time = result[key].end - result[key].start;
    },
    finish: () => {
      self.end("all");
      return result;
    },
    wrap: (key, fn) => {
      self.start(key);
      fn();
      self.end(key);
    },
    result,
  };

  self.start("all");
  return self;
};
