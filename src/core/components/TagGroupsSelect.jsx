import { useMemo } from "react";
import { useStableCallback, useTagGroups } from "@/core/hooks";
import { Select } from "@mantine/core";

const useTagGroupsSelectOptions = (filter) => {
  const [tagGroups] = useTagGroups();
  const stableFilter = useStableCallback((value) => {
    return filter ? filter(value) : true;
  });
  return useMemo(() => {
    const options = tagGroups.filter(stableFilter).map((group) => ({
      label: group.name,
      value: group.id,
    }));
    return [{ label: "None", value: "" }, ...options];
  }, [stableFilter, tagGroups]);
};

export const TagGroupsSelect = ({
  value = "",
  filter,
  filterError = "No valid groups avaiable",
  error,
  onChange,
  ...props
}) => {
  const data = useTagGroupsSelectOptions(filter);

  return (
    <Select
      label="Tag Groups"
      data={data}
      error={error || data.length === 1 ? filterError : undefined}
      value={value}
      onChange={onChange}
      maxDropdownHeight={350}
      allowDeselect={false}
      {...props}
    />
  );
};
