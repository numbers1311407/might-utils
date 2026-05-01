import { SortSelect } from "@/core/components";

const SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Readiness", value: "diffScore name" },
  { label: "Total Might - High", value: "-score name" },
  { label: "Total Might - Low", value: "score name" },
  {
    label: "Might Variance - Low",
    value: "mightSD mightRange -mightAvg",
  },
  {
    label: "Might Variance - High",
    value: "-mightSD -mightRange mightAvg",
  },
  {
    label: "Might Density - High",
    value: "-mightAvg -mightTotal size",
  },
  {
    label: "Might Density - Low",
    value: "mightAvg mightTotal -size",
  },
];

export const PartySortSelect = ({ sort, setSort }) => {
  return <SortSelect sort={sort} setSort={setSort} data={SORT_OPTIONS} />;
};
