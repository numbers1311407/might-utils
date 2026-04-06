import { useRef } from "react";
import { Select } from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { useTagRulesSelectOptions } from "./use-tag-rules-select-options.js";

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
