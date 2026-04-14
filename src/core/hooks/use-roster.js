import { useMemo } from "react";
import { useRosterStore, useRosterStoreApi as api } from "@/model/store";

export const useRoster = (options = {}) => {
  const { classTags = false, activeOnly: optActiveOnly } = options;

  const rawRoster = useRosterStore((store) => store.roster);
  const storeActiveOnly = useRosterStore((store) => store.activeOnly);
  const activeOnly = optActiveOnly ?? storeActiveOnly;

  const roster = useMemo(() => {
    return !classTags
      ? rawRoster
      : rawRoster.map((char) => api.getChar(char.name, { classTags: true }));
  }, [classTags, rawRoster]);

  return useMemo(() => {
    return roster.filter((char) => (activeOnly ? char.active : true));
  }, [roster, activeOnly]);
};
