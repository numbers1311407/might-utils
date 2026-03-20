import { deepEqual } from "fast-equals";
import { createStore } from "./create-store.js";

/**
 * Store helper which expects a schema with id and default id generation,
 * name with an expectation of a unique name, and possibly default objects.
 *
 * Defaults should come with pregenerated IDs if given to avoid regeneration
 * on startup.
 *
 * Soft enforcement of name uniqnueness by appending numbered suffixes to
 * duplicate names until unique.
 */
export const createRegistryStore = (name, recordSchema, options = {}) => {
  const defaults = options.defaults?.reduce((acc, record) => {
    const parsed = recordSchema.parse(record);
    return {
      ...acc,
      [parsed.id]: parsed,
    };
  }, {});

  const handleDirtyDefaults = (record, state) => {
    const origDefaults = defaults[record.id];
    if (origDefaults) {
      if (deepEqual(record, origDefaults)) {
        state.dirtyDefaults = state.dirtyDefaults.filter(
          (id) => id !== record.id,
        );
      } else if (state.dirtyDefaults.indexOf(record.id) === -1) {
        state.dirtyDefaults.push(record.id);
      }
    }
  };

  const initialStore = {
    registry: structuredClone(defaults || {}),
  };

  if (defaults) {
    initialStore.dirtyDefaults = [];
  }

  const useStore = createStore(name, () => initialStore);

  const defaultsApi = {
    isDefault: (record) => {
      const id = typeof record === "string" ? record : record?.id;
      return !!id && id in defaults;
    },

    isDirtyDefault: (record) => {
      const id = typeof record === "string" ? record : record?.id;
      return api.isDefault(record) && !deepEqual(defaults[id], record);
    },
  };

  const { getState: get, setState: set } = useStore;
  const api = {
    ...(defaults ? defaultsApi : {}),

    nameAvailable: (record) => {
      let name;
      if (typeof record === "string") {
        name = record;
        record = null;
      } else {
        name = record.name;
      }
      const used = Object.values(get().registry)
        .filter((g) => !record || g.id !== record.id)
        .map((g) => g.name.toLowerCase());

      return !used.includes(name.toLowerCase());
    },

    isRemovable: (record) => {
      return !api.isDefault(record);
    },

    isNew: (record) => {
      return !record?.id || !(record.id in get().registry);
    },

    resetDefault: (record) => {
      const id = typeof record === "string" ? record : record?.id;
      const origDefault = defaults[id];

      if (origDefault) {
        api.add(origDefault);
      }
    },

    get: (id) => {
      return get().registry[id];
    },

    copy: (record, done) => {
      return api.add(api.getCopy(record), done);
    },

    getCopy: (record) => {
      let { id: _, ...copy } = record;
      let i = 1;
      let name = record.name;
      while (name && !api.nameAvailable(name)) {
        name = `${record.name} (${i++})`;
      }
      return recordSchema.parse({ ...copy, name });
    },

    add: (record, done) => {
      set((state) => {
        const clone = api.isNew(record)
          ? api.getCopy(record)
          : recordSchema.parse(record);

        state.registry[clone.id] = clone;

        if (defaults) {
          handleDirtyDefaults(clone, state);
        }
      });
      done?.(api.get(id));
    },

    remove: (record) => {
      const id = typeof record === "string" ? record : record?.id;

      if (id in defaults) return;

      set((state) => {
        const { [id]: _, ...registry } = state.registry;
        state.registry = registry;
      });
    },
  };

  return { useStore, api };
};
