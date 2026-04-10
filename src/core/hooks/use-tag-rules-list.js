import { useMemo } from "react";
import { useTagRulesStore } from "@/model/store";
import { defaultFiltersTagRules } from "@/config/defaults";

const defaultIds = {
  filters: defaultFiltersTagRules.id,
};

export const useTagRulesList = (type) => {
  const sets = useTagRulesStore((store) => store.sets);

  return useMemo(() => {
    const defaultId = defaultIds[type];
    return Object.values(sets)
      .filter((set) => !type || set.type === type)
      .sort((a, b) => {
        if (defaultId && a.id === defaultId) return -1;
        if (defaultId && b.id === defaultId) return 1;
        return b - a;
      });
  }, [sets, type]);
};
