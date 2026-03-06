import { findLineups } from "./find-lineups.js";

self.onmessage = function (evt) {
  const [roster, maxScore, options] = evt.data;
  try {
    const result = findLineups(roster, maxScore, options);
    postMessage(result);
  } catch (error) {
    postMessage({ error });
  }
};
