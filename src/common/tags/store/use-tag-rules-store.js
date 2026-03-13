import { deepEqual } from "fast-equals";
import { createStore } from "@/common/store";
import { defaultFiltersTagRules } from "../defaults.js";
import { tagRuleSetSchema } from "../schema";

// TODOS
// - Rule sets probably need IDs, this will solve a few problems. IDs
//   would be generated on add, possibly in a pre-validation step outside
//   the store so the UI could access it immediately. One nice feature here
//   would be clean URLs to maintain current rule set in history.
//
// - Add the rule set selector on the finder controls.
//
// - Rename rule set modal.
// - Add/edit rule modal.
//
// - Complete the roster list UI
//   - There probably doesn't need to be a clear roster button.
//   - The roster list should show each characters current score and a total current
//     score for active characters and maybe some simple stats like a tag cloud.
//
// - At some point all the pages should have JSON editors for power users
//   - Each rule set
//   - Class tags
//   - Roster
//
// - Special case the "role" tag
//   - Define the base role tag set
//   - Add multiple roles grouping (by adding a char twice like Difa (tank) & Difa (dps)
//
// - Finish up the grouping functionality and add the grouping dropdown on the
//   lineups finder controls.

const findRuleIndex = (rules, { type, value }) => {
  return rules.findIndex((r) => r.type === type && r.value === value);
};

const addUniquely = (array, value) => {
  return Array.from(new Set([...array, value]));
};

const defaultFilters = structuredClone(defaultFiltersTagRules);

const defaultTypeStorage = {
  filters: "unique",
};
const defaultsMap = {
  filters: [defaultFilters],
};
const defaults = Object.values(defaultsMap).flat();
const defaultIds = defaults.map((set) => set.id);

const handleDirtyDefaults = (ruleSet, state) => {
  const origDefaults = defaults.find((d) => d.id === ruleSet.id);

  if (origDefaults) {
    if (deepEqual(ruleSet, origDefaults)) {
      state.dirtyDefaults = state.dirtyDefaults.filter(
        (id) => id !== ruleSet.id,
      );
    } else {
      state.dirtyDefaults.push(ruleSet.id);
    }
  }
};

export const useTagRulesStore = createStore("might-utils-tag-rules", () => ({
  active: {
    filters: [defaultFilters.id],
  },
  dirtyDefaults: [],
  sets: {
    [defaultFilters.id]: defaultFilters,
  },
}));

const { getState: get, setState: set } = useTagRulesStore;
export const useTagRulesStoreApi = {
  nameAvailable: (name) => {
    const used = Object.values(get().sets).map((set) => set.name.toLowerCase());
    return !used.includes(name.toLowerCase());
  },

  restoreDefaultSet: (id) => {
    const cleanDefault = defaults.find((d) => d.id === id);

    if (cleanDefault) {
      useTagRulesStoreApi.addSet(cleanDefault);
    }
  },

  activate: (id) => {
    set((state) => {
      const ruleSet = state.sets[id];
      const type = ruleSet?.type;

      if (type in defaultTypeStorage) {
        const storage = defaultTypeStorage[type];

        if (storage === "unique") {
          state.active[type] = [ruleSet.id];
        } else {
          state.active[type] = addUniquely(state.active[type], ruleSet.id);
        }
      }
    });
  },

  deactivate: (id) => {
    set((state) => {
      const ruleSet = state.sets[id];
      const type = ruleSet?.type;

      if (state.active[type].includes(id)) {
        state.active[type] = (state.active[type] || []).filter(
          (id) => id !== ruleSet.id,
        );
      }
    });
  },

  getSet: (id) => {
    return get().sets[id];
  },

  addSet: (ruleSet, done) => {
    const clone = tagRuleSetSchema.parse(ruleSet);

    set((state) => {
      state.sets[clone.id] = clone;
      handleDirtyDefaults(clone, state);
      done?.(clone);
    });
  },

  removeSet: (id) => {
    if (defaultIds.includes(id)) return;

    set((state) => {
      const ruleSet = state.sets[id];

      if (ruleSet) {
        delete state.sets[id];

        const type = ruleSet.type;
        if (state.active[type].includes(id)) {
          state.active[type] = (state.active[type] || []).filter(
            (id) => id !== ruleSet.id,
          );
        }
      }
    });
  },

  renameSet: (id, name) => {
    // TODO throw? (can't rename default sets)
    if (defaultIds.includes(id)) return;

    set((state) => {
      const ruleSet = state.sets[id];
      const names = Object.values(state.sets).map((set) => set.name);

      if (ruleSet && names.every((n) => n !== name)) {
        ruleSet.name = name;
      }
    });
  },

  addRule: (id, size, rule) => {
    set((state) => {
      const ruleSet = state.sets[id];

      if (ruleSet) {
        const rules = (ruleSet.rules[size] ||= []);
        const i = findRuleIndex(rules[size], rule);
        if (i !== -1) {
          rules[size].push({ ...rule });
        } else {
          rules[size][i] = { ...rule };
        }

        const clone = tagRuleSetSchema.parse(ruleSet);
        handleDirtyDefaults(clone, state);
      }
    });
  },

  removeRule: (id, size, value) => {
    set((state) => {
      const ruleSet = state.sets[id];

      if (ruleSet?.rules?.[size]) {
        const i =
          typeof value === "number"
            ? value
            : findRuleIndex(ruleSet.rules[size], value);

        if (i !== -1) {
          const rule = ruleSet.rules[size][i];
          ruleSet.rules[size] = ruleSet.rules[size].filter((r) => r !== rule);
        }

        const clone = tagRuleSetSchema.parse(ruleSet);
        handleDirtyDefaults(clone, state);
      }
      return state;
    });
  },
};
