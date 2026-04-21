import { FindPartiesError } from "@/core/party-finder/find-parties-error.js";
import { findParties } from "./find-parties.js";

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
