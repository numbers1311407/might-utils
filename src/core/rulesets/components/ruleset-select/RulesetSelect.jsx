import { MultiSelect } from "@mantine/core";
import { useRulesSelectOptions } from "./use-rules-select-options.js";

export const RulesetSelect = ({
  type,
  onChange,
  label = "Rulesets",
  labelActive = true,
  ...props
}) => {
  const { data, checked } = useRulesSelectOptions(type, { labelActive });

  return (
    <MultiSelect
      clearSectionMode="clear"
      data={data}
      label={label}
      value={checked}
      onChange={onChange}
      maxDropdownHeight={350}
      {...props}
    />
  );
};
