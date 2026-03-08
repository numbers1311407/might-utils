import LineupsWorker from "./find-lineups.worker.js?worker";

export const findLineupsAsync = async (roster, targetScore, options) => {
  const lineupsWorker = new LineupsWorker();

  console.log({ roster, targetScore, options });

  return new Promise((resolve, reject) => {
    lineupsWorker.addEventListener("message", ({ data }) => {
      if (data.type === "WORKER_LOG") {
        console.log(JSON.parse(data.data));
        return;
      }
      if (data.error) {
        reject(data.error);
      } else {
        console.log(data);
        resolve(data);
      }
    });
    lineupsWorker.postMessage([roster, targetScore, options]);
  }).finally(() => {
    lineupsWorker.terminate();
  });
};
