import { useMemo } from "react";
import { useTagRulesStore, useTagRulesStoreApi as api } from "@/model/store";

export const useTagRulesActiveFilters = () => {
  const activeIds = useTagRulesStore((store) => store.active.filters);

  return useMemo(() => {
    return activeIds.map((id) => api.getSet(id).rules).flat();
  }, [activeIds]);
};
