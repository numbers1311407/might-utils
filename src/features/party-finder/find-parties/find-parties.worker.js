import { findParties } from "./find-parties.js";
import { FindPartiesError } from "./find-parties-error.js";

self.onmessage = function (evt) {
  const [roster, maxScore, options] = evt.data;
  try {
    const result = findParties(roster, maxScore, options);
    postMessage(result);
  } catch (err) {
    const error = err instanceof FindPartiesError ? err.toJSON() : err;
    postMessage({ error });
  }
};
