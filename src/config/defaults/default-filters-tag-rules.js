const tagRule = (tag) => ({
  combinator: "and",
  not: false,
  rules: [{ field: "tags", operator: "contains", value: tag }],
});

export const defaultFiltersTagRules = {
  name: "Standard",
  type: "filters",
  id: "standard-rules",
  rules: [
    { size: [2, 8], type: "range", query: tagRule("tank"), value: [1, 1] },
    { size: [2, 6], type: "range", query: tagRule("healer"), value: [1, 1] },
    { size: [3, 6], type: "range", query: tagRule("support"), value: [0, 1] },
    { size: [3, 6], type: "range", query: tagRule("dps"), value: [3] },
    { size: [7, 12], type: "range", query: tagRule("healer"), value: [2] },
    { size: [9, 12], type: "range", query: tagRule("support"), value: [1] },
    { size: [9, 12], type: "range", query: tagRule("dps"), value: [4] },
    { size: [9, 12], type: "range", query: tagRule("tank"), value: [2, 2] },
  ],
};
