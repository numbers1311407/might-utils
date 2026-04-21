import { TagRulesetSelect } from "./tag-ruleset-select";
import { useTagRulesStoreApi as api } from "@/model/store";

export const ActiveTagFiltersSelect = (props) => {
  return (
    <TagRulesetSelect
      type="filters"
      {...props}
      onChange={(ids) => {
        if (!ids.length || ids.includes("")) {
          api.deactivateType("filters");
        } else {
          api.activate(ids);
        }
      }}
      placeholder="Select ruleset..."
      labelActive={false}
      clearable
      includeNone
    />
  );
};
