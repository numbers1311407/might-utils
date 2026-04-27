import { useMemo } from "react";
import { useRulesStore, useRulesStoreApi as api } from "@/model/store";

export const useRulesActiveFilters = () => {
  const activeIds = useRulesStore((store) => store.active.filters);

  return useMemo(() => {
    return activeIds.map((id) => api.getSet(id).rules).flat();
  }, [activeIds]);
};
