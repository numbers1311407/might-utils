import { use } from "react";
import { createAppStorageSliceHook } from "@/common/store";
import { LineupsContext } from "./context.js";

export const useFindLineupsResults = () => {
  const { resultsPromise } = use(LineupsContext);
  return use(resultsPromise);
};

// TODO circular dependencies inherent in the store loading defaults from this module
export const useLineupsSettingStore = createAppStorageSliceHook("lineups");
