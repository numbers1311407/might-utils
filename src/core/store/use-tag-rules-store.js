import { deepEqual } from "fast-equals";
import { defaultFiltersTagRules } from "@/core/config/defaults";
import { tagRulesetSchema, tagRuleSchema } from "@/core/schemas";
import { createStore } from "./helpers";

const TYPES = {
  Unique: "unique",
  Multi: "multi",
};

const findRuleIndex = (rules, { id }) => {
  return rules.findIndex((r) => r.id === id);
};

const addUniquely = (array, value) => {
  return Array.from(new Set([...array, value]));
};

const defaultFilters = tagRulesetSchema.parse(defaultFiltersTagRules);

const defaultTypeStorage = {
  filters: TYPES.Multi,
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

// TODO originally there were to be multiple types of these rules but I don't
// even remember what the original concept was. Since there's only "filters"
// a lot if this could be simplified.
export const useTagRulesStore = createStore("might-utils-tag-rules", () => ({
  active: {
    filters: [defaultFilters.id],
  },
  dirtyDefaults: [],
  groupSizeTwenty: false,
  sets: {
    [defaultFilters.id]: defaultFilters,
  },
}));

const { getState: get, setState: set } = useTagRulesStore;
const api = {
  nameAvailable: (name, record) => {
    if (typeof name === "object") {
      record = name;
      name = record?.name;
    }
    const persisted = record?.id && api.getSet(record.id);
    if (persisted && persisted.name === name) {
      return true;
    }
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

        if (storage === TYPES.Unique) {
          state.active[type] = [ruleset.id];
        } else {
          state.active[type] = addUniquely(state.active[type], ruleset.id);
        }
      }
    });
  },

  deactivateType: (type) => {
    set((state) => {
      state.active[type] = [];
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

  isRulesetSorted: (id) => {
    const ruleset = api.getSet(id);

    if (!ruleset) return false;

    const { rules } = ruleset;
    const { success, data } = tagRulesetSchema.safeParse(ruleset);
    return success && data.rules.every((rule, i) => rule.id === rules[i].id);
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

  setGroupSizeTwenty: (bool) => {
    set((state) => {
      state.groupSizeTwenty = bool;
    });
  },
};

export const useTagRulesStoreApi = api;
