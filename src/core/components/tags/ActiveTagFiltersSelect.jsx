import { TagRulesetSelect } from "./tag-ruleset-select";
import { useTagRulesStore, useTagRulesStoreApi as api } from "@/core/store";

export const ActiveTagFiltersSelect = (props) => {
  const value = useTagRulesStore((store) => store.active.filters?.[0] || "");

  return (
    <TagRulesetSelect
      type="filters"
      {...props}
      onChange={(id) => {
        if (id) {
          api.activate(id);
        } else {
          api.deactivateType("filters");
        }
      }}
      value={value}
      placeholder="Select ruleset..."
      labelActive={false}
      clearable
      includeNone
    />
  );
};
