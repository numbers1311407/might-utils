import { SortSelect } from "@/core/components";

const DATA = [
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

export const PartySortSelect = ({ sort, setSort, ...props }) => {
  return <SortSelect sort={sort} setSort={setSort} data={DATA} {...props} />;
};
