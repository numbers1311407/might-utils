export const defaultTimeFlagTagRules = {
  id: "time-flagged",
  name: "Flagged for Time",
  type: "filters",
  rules: [
    {
      size: [1, 12],
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
