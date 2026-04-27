import { useMemo } from "react";
import { useRulesStore } from "@/model/store";
import { useRulesList } from "@/core/hooks";

export const useRulesSelectOptions = (type, options = {}) => {
  const { labelActive = true, includeNone } = options;
  const list = useRulesList(type);
  const active = useRulesStore((store) => store.active);

  return useMemo(() => {
    const checked = active[type] || [];
    const baseOptions = includeNone ? [{ label: "None", value: "" }] : [];

    const data = baseOptions.concat(
      list.map((set) => ({
        label: labelActive
          ? `${set.name}${checked.includes(set.id) ? " (active)" : ""}`
          : set.name,
        value: set.id,
      })),
    );

    return { data, checked };
  }, [labelActive, list, active, type, includeNone]);
};
