import { createStore } from "@/common/store";
import { defaultTagRules } from "../defaults.js";

const validateRulesSize = (size) => {
  if (isNaN(size) || Number(size) < 1 || Number(size) > 20) {
    throw `invalid size: ${size}, must be between 1 and 20`;
  }
};

const findRuleIndex = (ruleSet, { type, value }) => {
  return ruleSet.findIndex((r) => r.type === type && r.value === value);
};

export const useTagRulesStore = createStore(
  "might-utils-tag-rules",
  (set, get) => ({
    rules: { ...defaultTagRules },
    setTagRules: (size, ruleSet) => {
      validateRulesSize(size);
      set(({ rules }) => {
        rules[size] = ruleSet;
      });
    },
    resetAllTagRules: () => {
      set((state) => {
        state.rules = { ...defaultTagRules };
      });
    },
    clearTagRules: (size) => {
      validateRulesSize(size);
      get().setTagRules(size, []);
    },
    addTagRule: (size, rule) => {
      validateRulesSize(size);
      set(({ rules }) => {
        const ruleSet = rules[size] || [];
        const i = findRuleIndex(ruleSet, rule);
        if (i === -1) {
          ruleSet.push(rule);
        } else {
          ruleSet[i] = rule;
        }
      });
    },
    removeTagRule: (size, rule) => {
      validateRulesSize(size);
      set(({ rules }) => {
        const ruleSet = rules[size] || [];
        const i = findRuleIndex(ruleSet, rule);
        if (i !== -1) {
          ruleSet.splice(i, 1);
        }
      });
    },
  }),
);
