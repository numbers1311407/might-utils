export const createRulesetFromSlots = (slots) => {
  const rules = slots.map((slot) =>
    createBasicRangeRule({
      // Even though the comp may have a static or minimum count, we set the
      // initial to be [min, max] on the assumption that this ruleset should
      // be exclusive.
      size: [1, 20],
      count: [slot.count, slot.count],
      rules: [
        {
          field: "warden",
          operator: "=",
          value: slot.warden,
        },
        {
          field: "level",
          operator: "=",
          value: slot.level,
        },

        ...(slot.name
          ? [
              {
                field: "name",
                operator: "=",
                value: slot.name,
              },
            ]
          : []),

        ...(slot.class
          ? [
              {
                field: "class",
                operator: "=",
                value: slot.class,
              },
            ]
          : []),

        ...(slot.tags
          ? slot.tags.map((tag) => ({
              field: "tags",
              operator: "contains",
              value: tag,
            }))
          : []),
      ],
    }),
  );

  return rules;
};

const createBasicRangeRule = ({ size, count, rules }) => {
  return {
    size,
    type: "range",
    value: count,
    query: {
      combinator: "and",
      not: false,
      rules,
    },
  };
};
