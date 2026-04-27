import { RulesetSelect } from "./ruleset-select";
import { useRulesStoreApi as api } from "@/model/store";

export const ActiveFilterRulesetsSelect = (props) => {
  return (
    <RulesetSelect
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
    />
  );
};
