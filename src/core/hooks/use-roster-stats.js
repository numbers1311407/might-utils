import { useMemo } from "react";
import { useRoster } from "@/core/hooks";
import { useRosterStoreApi as api } from "@/model/store";

export const useRosterStats = () => {
  const roster = useRoster({ classTags: true });

  return useMemo(() => {
    return api.getStats(roster);
  }, [roster]);
};
