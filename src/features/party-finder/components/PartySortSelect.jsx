import { useMemo } from "react";
import { Select } from "@mantine/core";
import { usePartyFinderOption } from "../hooks";

const OPTIONS = [
  {
    label: "Lowest Might Variance",
    value: "-score sdMight -size",
  },
  {
    label: "Highest Might Variance",
    value: "-score -sdMight size",
  },
  {
    label: "Highest Avg. Power",
    value: "-score -avgMight -avgWarden size",
  },
  {
    label: "Highest Avg. Level",
    value: "-score -avgLevel size",
  },
];

export const PartySortSelect = () => {
  const [sort, setSort] = usePartyFinderOption("sort");

  const placeholder = useMemo(
    () => OPTIONS.find((o) => o.value === sort)?.label,
    [sort],
  );

  return (
    <Select
      leftSection="Sort By:"
      leftSectionWidth="6em"
      placeholder={placeholder}
      data={OPTIONS}
      value={sort}
      onChange={setSort}
    />
  );
};
