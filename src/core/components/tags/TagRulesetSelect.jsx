import { useRef } from "react";
import { Select } from "@mantine/core";
import {
  useTagRulesSelectOptions,
  useTagRulesStoreApi as api,
} from "@/core/store";
import { useDraftState } from "@/core/hooks";

export const TagRulesetSelect = ({
  type,
  onChange,
  value,
  clearable,
  label = "Ruleset",
  labelActive = true,
  includeNone = false,
  ...props
}) => {
  const data = useTagRulesSelectOptions(type, { labelActive, includeNone });
  const ref = useRef();
  const [search, setSearch] = useDraftState(value);

  return (
    <Select
      allowDeselect={false}
      clearable={clearable}
      data={data}
      label={label}
      onSearchChange={setSearch}
      ref={ref}
      searchValue={search}
      searchable
      value={value}
      onFocus={() => {
        setSearch("");
      }}
      onChange={(value, option) => {
        onChange(value, option);
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
      {...props}
    />
  );
};
