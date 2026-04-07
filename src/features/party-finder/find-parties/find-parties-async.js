import PartiesWorker from "./find-parties.worker.js?worker";
import { FindPartiesError } from "./find-parties-error.js";

export const findPartiesAsync = async (roster, targetScore, options) => {
  const partiesWorker = new PartiesWorker();

  return new Promise((resolve, reject) => {
    partiesWorker.addEventListener("message", ({ data }) => {
      if (data.type === "WORKER_LOG") {
        console.log(JSON.parse(data.data));
        return;
      }
      if (data.error) {
        console.error("worker error", data.error);

        if (data.error.__type === "FindPartiesError") {
          const error = new FindPartiesError(
            data.error.message,
            data.error.code,
          );
          error.stack = data.error.stack;
          reject(error);
        } else {
          reject(data.error);
        }
      } else {
        console.log("worker message", data);
        resolve(data);
      }
    });
    partiesWorker.postMessage([roster, targetScore, options]);
  }).finally(() => {
    partiesWorker.terminate();
  });
};
