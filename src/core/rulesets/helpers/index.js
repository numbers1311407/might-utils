import { processComp } from "@/model/schemas";
import { sum } from "@/utils";

export const createRuleset = ({ party, comp }) => {
  return party ? createRulesetFromParty(party) : createRulesetFromComp(comp);
};

export const createRulesetFromComp = (value) => {
  const [comp] = typeof value === "string" ? processComp(value) : value;

  const minSize = sum(comp.map(({ count }) => count));

  const rules = comp.map((slot) =>
    createBasicRangeRule({
      size: [minSize, 20],
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
        ...slot.terms.map((term) => ({
          field: "tags",
          operator: "contains",
          value: term,
        })),
      ],
    }),
  );

  return _createRuleset({ rules });
};

export const createRulesetFromParty = (party) => {
  const rules = party.map((slot) =>
    createBasicRangeRule({
      size: [party.length, 20],
      count: [1, 1],
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
        {
          field: "name",
          operator: "=",
          value: slot.name,
        },
      ],
    }),
  );

  return _createRuleset({ rules });
};

const _createRuleset = ({ rules }) => ({
  type: "filters",
  rules,
});

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
