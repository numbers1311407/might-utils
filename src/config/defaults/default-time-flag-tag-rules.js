export const defaultTimeFlagTagRules = {
  id: "time-flagged",
  name: "Time-Flagged",
  type: "filters",
  rules: [
    {
      size: [1, 20],
      type: "all",
      value: "all",
      query: {
        combinator: "and",
        not: false,
        rules: [
          {
            field: "tags",
            operator: "contains",
            value: "flag-time",
          },
        ],
      },
    },
  ],
};
