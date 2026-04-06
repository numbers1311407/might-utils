import { useMemo } from "react";
import { useTagRulesStore, useTagRulesStoreApi as api } from "@/core/store";

export const useTagRulesActiveFilters = () => {
  const activeIds = useTagRulesStore((store) => store.active.filters);
  const activeId = activeIds?.[0];

  return useMemo(() => {
    return activeId && api.getSet(activeId);
  }, [activeId]);
};
