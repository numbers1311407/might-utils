import PartiesWorker from "./find-parties.worker.js?worker";

export const findPartiesAsync = async (roster, targetScore, options) => {
  const partiesWorker = new PartiesWorker();

  return new Promise((resolve, reject) => {
    partiesWorker.addEventListener("message", ({ data }) => {
      if (data.type === "WORKER_LOG") {
        console.log(JSON.parse(data.data));
        return;
      }
      if (data.error) {
        reject(data.error);
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
