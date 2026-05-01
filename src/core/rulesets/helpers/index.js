const getSlotKey = (slot) =>
  Object.keys(slot)
    .reduce((segs, key) => {
      return segs.concat(
        `${key}:${key === "tags" ? slot[key].join(",") : slot[key]}`,
      );
    }, [])
    .join("/");

const groupSlots = (slots) => {
  return Object.values(
    slots.reduce((grouped, slot) => {
      const key = getSlotKey(slot);
      if (!grouped[key]) {
        grouped[key] = { count: 0, ...slot };
      }
      grouped[key].count += 1;
      return grouped;
    }, {}),
  );
};

export const createRulesetFromSlots = (slots, options = {}) => {
  const { count = "minimum" } = options;

  const rules = groupSlots(slots).map((slot) =>
    createBasicRangeRule({
      // Even though the comp may have a static or minimum count, we set the
      // initial to be [min, max] on the assumption that this ruleset should
      // be exclusive.
      size: [1, 20],
      count: count === "exact" ? [slot.count, slot.count] : [slot.count],
      rules: [
        ...(slot.warden !== undefined
          ? [
              {
                field: "warden",
                operator: "=",
                value: slot.warden,
              },
            ]
          : []),

        ...(slot.level !== undefined
          ? [
              {
                field: "level",
                operator: "=",
                value: slot.level,
              },
            ]
          : []),

        ...(slot.name !== undefined
          ? [
              {
                field: "name",
                operator: "=",
                value: slot.name,
              },
            ]
          : []),

        ...(slot.class !== undefined
          ? [
              {
                field: "class",
                operator: "=",
                value: slot.class,
              },
            ]
          : []),

        ...(slot.tags?.length
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
