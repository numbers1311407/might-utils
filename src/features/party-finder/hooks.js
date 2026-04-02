import { use } from "react";
import { PartyFinderContext } from "./context.js";

export const useFindPartiesResults = () => {
  const { resultsPromise } = use(PartyFinderContext);
  return use(resultsPromise);
};
