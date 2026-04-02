import { findParties } from "./find-parties.js";

self.onmessage = function (evt) {
  const [roster, maxScore, options] = evt.data;
  try {
    const result = findParties(roster, maxScore, options);
    postMessage(result);
  } catch (error) {
    postMessage({ error });
  }
};
