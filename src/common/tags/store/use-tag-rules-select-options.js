import { useMemo } from "react";
import { useTagRulesList } from "./use-tag-rules-list.js";
import { useTagRulesStore } from "./use-tag-rules-store.js";

export const useTagRulesSelectOptions = (type) => {
  const list = useTagRulesList(type);
  const active = useTagRulesStore((store) => store.active);

  return useMemo(() => {
    const typedActive = active[type] || [];

    return list.map((set) => ({
      label: `${set.name}${typedActive.includes(set.id) ? " (active)" : ""}`,
      value: set.id,
    }));
  }, [list, active, type]);
};
