import { MultiSelect } from "@mantine/core";
import { useTagRulesSelectOptions } from "./use-tag-rules-select-options.js";

export const TagRulesetSelect = ({
  type,
  onChange,
  label = "Rulesets",
  labelActive = true,
  ...props
}) => {
  const { data, checked } = useTagRulesSelectOptions(type, { labelActive });

  return (
    <MultiSelect
      clearSectionMode="clear"
      data={data}
      label={label}
      value={checked}
      onChange={onChange}
      {...props}
    />
  );
};
