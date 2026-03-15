import { deepEqual } from "fast-equals";
import { createStore } from "@/utils";
import { defaultFiltersTagRules } from "@/core/config/defaults";
import { tagRulesetSchema, tagRuleSchema } from "@/core/schemas";

const findRuleIndex = (rules, { type, value, warden }) => {
  return rules.findIndex(
    (r) => r.type === type && r.value === value && r.warden === warden,
  );
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

const handleDirtyDefaults = (ruleset, state) => {
  const origDefaults = defaults.find((d) => d.id === ruleset.id);

  if (origDefaults) {
    if (deepEqual(ruleset, origDefaults)) {
      state.dirtyDefaults = state.dirtyDefaults.filter(
        (id) => id !== ruleset.id,
      );
    } else {
      state.dirtyDefaults.push(ruleset.id);
    }
  }
};

export const useTagRulesStore = createStore("might-utils-tag-rules", () => ({
  active: {
    filters: [defaultFilters.id],
  },
  dirtyDefaults: [],
  sets: {
    [defaultFilters.id]: tagRulesetSchema.parse(defaultFilters),
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
      const ruleset = state.sets[id];
      const type = ruleset?.type;

      if (type in defaultTypeStorage) {
        const storage = defaultTypeStorage[type];

        if (storage === "unique") {
          state.active[type] = [ruleset.id];
        } else {
          state.active[type] = addUniquely(state.active[type], ruleset.id);
        }
      }
    });
  },

  deactivate: (id) => {
    set((state) => {
      const ruleset = state.sets[id];
      const type = ruleset?.type;

      if (state.active[type].includes(id)) {
        state.active[type] = (state.active[type] || []).filter(
          (id) => id !== ruleset.id,
        );
      }
    });
  },

  getSet: (id) => {
    return get().sets[id];
  },

  addSet: (ruleset, done) => {
    const clone = tagRulesetSchema.parse(ruleset);

    set((state) => {
      state.sets[clone.id] = clone;
      handleDirtyDefaults(clone, state);
      done?.(clone);
    });
  },

  removeSet: (id) => {
    if (defaultIds.includes(id)) return;

    set((state) => {
      const ruleset = state.sets[id];

      if (ruleset) {
        delete state.sets[id];

        const type = ruleset.type;
        if (state.active[type].includes(id)) {
          state.active[type] = (state.active[type] || []).filter(
            (id) => id !== ruleset.id,
          );
        }
      }
    });
  },

  renameSet: (id, name) => {
    // TODO throw? (can't rename default sets)
    if (defaultIds.includes(id)) return;

    set((state) => {
      const ruleset = state.sets[id];
      const names = Object.values(state.sets).map((set) => set.name);

      if (ruleset && names.every((n) => n !== name)) {
        ruleset.name = name;
      }
    });
  },

  addRule: (id, size, rule) => {
    set((state) => {
      const ruleset = state.sets[id];

      if (ruleset) {
        ruleset.rules[size] ||= [];
        rule = tagRuleSchema.parse(rule);

        const i = findRuleIndex(ruleset.rules[size], rule);

        if (i === -1) {
          ruleset.rules[size].push(rule);
        } else {
          ruleset.rules[size][i] = rule;
        }

        // if this was an existing rule then this operation was a move,
        // strip it from other arrays.
        for (const [othersize, rules] of Object.entries(ruleset.rules)) {
          if (othersize === String(size)) {
            continue;
          }
          const i = rules.findIndex((r) => r.id === rule.id);
          if (i !== -1) {
            rules.splice(i, 1);
          }
        }

        const clone = tagRulesetSchema.parse(ruleset);
        handleDirtyDefaults(clone, state);
      }
    });
  },

  removeRule: (id, size, value) => {
    set((state) => {
      const ruleset = state.sets[id];

      if (ruleset?.rules?.[size]) {
        const i =
          typeof value === "number"
            ? value
            : findRuleIndex(ruleset.rules[size], value);

        if (i !== -1) {
          const rule = ruleset.rules[size][i];
          ruleset.rules[size] = ruleset.rules[size].filter((r) => r !== rule);
        }

        const clone = tagRulesetSchema.parse(ruleset);
        handleDirtyDefaults(clone, state);
      }
      return state;
    });
  },
};
