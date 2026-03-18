export const defaultFiltersTagRules = {
  name: "Default",
  type: "filters",
  id: "default-filters",
  rules: [
    { size: [2, 8], type: "tag", value: "tank", range: "1" },
    { size: [2, 6], type: "tag", value: "healer", range: "1" },
    { size: [3, 6], type: "tag", value: "support", range: "1-" },
    { size: [3, 6], type: "tag", value: "dps", range: "3+" },
    { size: [7, 12], type: "tag", value: "healer", range: "2+" },
    { size: [9, 12], type: "tag", value: "support", range: "1+" },
    { size: [9, 12], type: "tag", value: "dps", range: "4+" },
    { size: [9, 12], type: "tag", value: "tank", range: "2" },
  ],
};
