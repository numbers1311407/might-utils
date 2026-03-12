import { createStore } from "@/common/store";
import { defaultTagRules } from "../defaults.js";
import { tagRuleSetSchema } from "../schema";

const defaultSetName = "Default";

const findRuleIndex = (ruleSet, { type, value }) => {
  return ruleSet.findIndex((r) => r.type === type && r.value === value);
};

export const useTagRulesStore = createStore(
  "might-utils-tag-rules",
  (set, get) => ({
    rules: new Map([[defaultSetName, structuredClone(defaultTagRules)]]),
    currentRuleSetName: defaultSetName,
    currentRuleSet: () => get().rules.get(get().currentRuleSetName),
    ruleSetNames: () => {
      return Array.from(get().rules.keys());
    },
    setCurrentRuleSet: (name) => {
      set((state) => {
        state.currentRuleSetName = name;
      });
    },
    getCurrentRuleSet: () => {
      return get().getRuleSet();
    },
    getRuleSet: (name) => {
      return get().rules.get(name ?? get().currentRuleSet);
    },
    setRuleSet: (name, ruleSet) => {
      tagRuleSetSchema.parse(ruleSet);
      set((state) => {
        state.rules.set(name, structuredClone(ruleSet));
      });
    },
    removeRuleSet: (name) => {
      set((state) => {
        state.rules.delete(name);
      });
    },
    renameRuleSet: (name, newName) => {
      set((state) => {
        const ruleSet = state.rules.get(name);
        if (ruleSet) {
          state.rules.delete(name);
          state.rules.set(newName, ruleSet);
        }
      });
    },
    setRule: (name, size, rule) => {
      set((state) => {
        const ruleSet = state.rules.get(name);
        if (ruleSet) {
          ruleSet[size] ||= [];
          const i = findRuleIndex(ruleSet[size], rule);
          if (i !== -1) {
            ruleSet[size].push({ ...rule });
          } else {
            ruleSet[size][i] = { ...rule };
          }
          tagRuleSetSchema.parse(ruleSet);
        }
      });
    },
    removeRule: (name, size, rule) => {
      set((state) => {
        const ruleSet = state.rules.get(name);
        if (ruleSet && ruleSet[size]) {
          const i = findRuleIndex(ruleSet[size], rule);
          if (i !== -1) {
            ruleSet[size].splice(i, 1);
          }
        }
      });
    },
    clearSizeRules: (name, size) => {
      set((state) => {
        const ruleSet = state.rules.get(name);
        if (ruleSet) {
          delete ruleSet[size];
        }
      });
    },
    resetDefaultRuleSet: () => {
      get().setRuleSet(defaultSetName, defaultTagRules);
    },
  }),
);
