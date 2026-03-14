export const defaultFiltersTagRules = {
  name: "Default",
  type: "filters",
  id: "default-filters",
  rules: {
    2: [
      { type: "tag", value: "tank", range: 1 },
      { type: "name", value: "geese", warden: 2 },
      { type: "tag", value: "healer", range: 1 },
      { type: "tag", value: "support", range: [0, 1] },
    ],
    6: [{ type: "tag", value: "dps", range: [2] }],
    7: [{ type: "tag", value: "tank", range: [1] }],
    9: [
      { type: "tag", value: "healer", range: [2, 3] },
      { type: "tag", value: "tank", range: 2 },
      { type: "tag", value: "dps", range: [3] },
      { type: "tag", value: "support", range: [0, 2] },
    ],
    10: [{ type: "tag", value: "support", range: [1, 2] }],
    12: [
      { type: "tag", value: "dps", range: [5] },
      { type: "tag", value: "healer", range: 3 },
      { type: "tag", value: "support", range: [1] },
    ],
  },
};
