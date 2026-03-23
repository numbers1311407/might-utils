import { deepEqual } from "fast-equals";
import { defaultFiltersTagRules } from "@/core/config/defaults";
import { tagRulesetSchema, tagRuleSchema } from "@/core/schemas";
import { createStore } from "./helpers";

const findRuleIndex = (rules, { id }) => {
  return rules.findIndex((r) => r.id === id);
};

const addUniquely = (array, value) => {
  return Array.from(new Set([...array, value]));
};

const defaultFilters = tagRulesetSchema.parse(defaultFiltersTagRules);

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
    } else if (state.dirtyDefaults.indexOf(ruleset.id) === -1) {
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
export const api = {
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
    const id = clone.id;

    set((state) => {
      state.sets[id] = clone;
      handleDirtyDefaults(clone, state);
    });

    done?.(api.getSet(id));
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

  addRule: (id, rule) => {
    set((state) => {
      const ruleset = state.sets[id];

      if (ruleset) {
        rule = tagRuleSchema.parse(rule);

        const i = findRuleIndex(ruleset.rules, rule);

        if (i === -1) {
          ruleset.rules.push(rule);
        } else {
          ruleset.rules[i] = rule;
        }

        const clone = tagRulesetSchema.parse(ruleset);
        handleDirtyDefaults(clone, state);
      }
    });
  },

  removeRule: (id, value) => {
    set((state) => {
      const ruleset = state.sets[id];

      const i =
        typeof value === "number" ? value : findRuleIndex(ruleset.rules, value);

      if (i !== -1) {
        const rule = ruleset.rules[i];
        ruleset.rules = ruleset.rules.filter((r) => r !== rule);
      }

      const clone = tagRulesetSchema.parse(ruleset);
      handleDirtyDefaults(clone, state);
    });
  },

  sortRuleset: (id) => {
    set((state) => {
      const ruleset = state.sets[id];

      if (ruleset) {
        const clone = tagRulesetSchema.parse(ruleset);
        state.sets[id] = clone;
        handleDirtyDefaults(clone, state);
      }
    });
  },
};

export const useTagRulesStoreApi = api;
