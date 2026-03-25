import { TagRulesetSelect } from "./TagRulesetSelect.jsx";
import { useTagRulesStore, useTagRulesStoreApi as api } from "@/core/store";

export const ActiveTagFiltersSelect = (props) => {
  const value = useTagRulesStore((store) => store.active.filters?.[0]);

  return (
    <TagRulesetSelect
      type="filters"
      {...props}
      onChange={(id) => api.activate(id)}
      value={value}
      labelActive={false}
    />
  );
};
