import { useMemo } from "react";
import { useTagRulesList } from "./use-tag-rules-list.js";
import { useTagRulesStore } from "./use-tag-rules-store.js";

export const useTagRulesSelectOptions = (type, options = {}) => {
  const { labelActive = true, includeNone } = options;
  const list = useTagRulesList(type);
  const active = useTagRulesStore((store) => store.active);

  return useMemo(() => {
    const typedActive = active[type] || [];
    const baseOptions = includeNone ? [{ label: "None", value: "" }] : [];

    return baseOptions.concat(
      list.map((set) => ({
        label: labelActive
          ? `${set.name}${typedActive.includes(set.id) ? " (active)" : ""}`
          : set.name,
        value: set.id,
      })),
    );
  }, [labelActive, list, active, type, includeNone]);
};
