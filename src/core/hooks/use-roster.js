import { useMemo } from "react";
import { useRosterStore, useRosterStoreApi as rosterApi } from "@/model/store";

export const useRoster = (options = {}) => {
  const { classTags = false, activeOnly: optActiveOnly } = options;

  const rawRoster = useRosterStore((store) => store.roster);
  const storeActiveOnly = useRosterStore((store) => store.activeOnly);
  const activeOnly = optActiveOnly ?? storeActiveOnly;

  return useMemo(
    () =>
      rawRoster
        .map((char) => rosterApi.getChar(char.name, { classTags }))
        .filter((char) => (activeOnly ? char.active : true)),
    [activeOnly, classTags, rawRoster],
  );
};
