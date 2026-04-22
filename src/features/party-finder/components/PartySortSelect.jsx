import { useMemo } from "react";
import { Select } from "@mantine/core";
import { usePartyFinderOption } from "../hooks";

const OPTIONS = [
  {
    label: "Might Variance - Low",
    value: "-score mightSD mightRange -mightAvg",
  },
  {
    label: "Might Variance - High",
    value: "-score -mightSD -mightRange mightAvg",
  },
  {
    label: "Might Density - High",
    value: "-score -mightAvg -mightTotal size",
  },
  {
    label: "Might Density - Low",
    value: "-score mightAvg mightTotal -size",
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
