import { Select } from "@mantine/core";
import { useMemo } from "react";

export const SortSelect = ({ sort, setSort, data }) => {
  const placeholder = useMemo(
    () => data.find((o) => o.value === sort)?.label,
    [sort, data],
  );

  return (
    <Select
      leftSection="Sort By:"
      leftSectionWidth="6em"
      placeholder={placeholder}
      data={data}
      value={sort}
      onChange={setSort}
      maxDropdownHeight={350}
    />
  );
};
