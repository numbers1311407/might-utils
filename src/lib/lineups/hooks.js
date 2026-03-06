import { use, useCallback, useState } from "react";
import { useAppStorage } from "@/lib/store";
import { LineupsContext } from "./context.js";

export const useFindLineupsResults = () => {
  const { resultsPromise } = use(LineupsContext);
  return use(resultsPromise);
};

export const useLineupsSettingStore = (setting) => {
  const [store, setStore] = useAppStorage();
  const storedValue = store?.lineups?.[setting];
  const [value, setValue] = useState(storedValue);

  const persistValue = useCallback(
    (value) => {
      setStore({
        ...store,
        lineups: {
          ...store.lineups,
          [setting]: value,
        },
      });
    },
    [store, setting, setStore],
  );

  return [value, setValue, persistValue];
};
