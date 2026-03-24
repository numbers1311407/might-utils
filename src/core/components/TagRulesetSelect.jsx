import { Select } from "@mantine/core";
import {
  useTagRulesSelectOptions,
  useTagRulesStoreApi as api,
} from "@/core/store";

export const TagRulesetSelect = ({
  type,
  onChange,
  value,
  label = "Filter Ruleset",
  labelActive = true,
  ...props
}) => {
  const data = useTagRulesSelectOptions(type, { labelActive });

  return (
    <Select
      data={data}
      value={value}
      label={label}
      onChange={(id) => {
        // NOTE unsure if intended but if you click the current value in the
        // select it will call onChange with null. Preventing that from calling
        // upstream here.
        if (id !== null && onChange) onChange(id);
      }}
      {...props}
    />
  );
};
