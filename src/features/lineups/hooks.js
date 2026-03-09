import { use } from "react";
import { LineupsContext } from "./context.js";

export const useFindLineupsResults = () => {
  const { resultsPromise } = use(LineupsContext);
  return use(resultsPromise);
};
