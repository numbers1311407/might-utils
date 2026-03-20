import { deepEqual } from "fast-equals";
import { createStore } from "@/utils";
import { defaultTagGroups } from "@/core/config/defaults";
import { tagGroupSchema } from "@/core/schemas";

const defaults = defaultTagGroups.reduce((acc, group) => {
  const parsed = tagGroupSchema.parse(group);
  return {
    ...acc,
    [parsed.id]: parsed,
  };
}, {});

const handleDirtyDefaults = (group, state) => {
  const origDefaults = defaults[group.id];

  if (origDefaults) {
    if (deepEqual(group, origDefaults)) {
      state.dirtyDefaults = state.dirtyDefaults.filter((id) => id !== group.id);
    } else if (state.dirtyDefaults.indexOf(group.id) === -1) {
      state.dirtyDefaults.push(group.id);
    }
  }
};

export const useTagGroupsStore = createStore("might-utils-tag-groups", () => ({
  dirtyDefaults: [],
  groups: structuredClone(defaults),
}));

const { getState: get, setState: set } = useTagGroupsStore;
const api = {
  nameAvailable: (group) => {
    let name;
    if (typeof group === "string") {
      name = group;
      group = null;
    } else {
      name = group.name;
    }
    const used = Object.values(get().groups)
      .filter((g) => !group || g.id !== group.id)
      .map((g) => g.name.toLowerCase());

    return !used.includes(name.toLowerCase());
  },

  isRemovable: (group) => {
    return !api.isDefault(group);
  },

  isDefault: (group) => {
    const id = typeof group === "string" ? group : group?.id;
    return !!id && id in defaults;
  },

  isDirtyDefault: (group) => {
    const id = typeof group === "string" ? group : group?.id;
    return api.isDefault(group) && !deepEqual(defaults[id], group);
  },

  isNew: (group) => {
    return !group?.id || !(group.id in get().groups);
  },

  resetDefault: (group) => {
    const id = typeof group === "string" ? group : group?.id;
    const origDefault = defaults[id];

    if (origDefault) {
      api.add(origDefault);
    }
  },

  get: (id) => {
    return get().groups[id];
  },

  copy: (group, done) => {
    return api.add(api.getCopy(group), done);
  },

  getCopy: (group) => {
    let { id: _, ...copy } = group;
    let i = 1;
    let name = group.name;
    while (name && !api.nameAvailable(name)) {
      name = `${group.name} (${i++})`;
    }
    return tagGroupSchema.parse({ ...copy, name });
  },

  add: (group, done) => {
    set((state) => {
      const clone = api.isNew(group)
        ? api.getCopy(group)
        : tagGroupSchema.parse(group);

      state.groups[clone.id] = clone;
      handleDirtyDefaults(clone, state);
    });
    done?.(api.get(id));
  },

  remove: (group) => {
    const id = typeof group === "string" ? group : group?.id;

    if (id in defaults) return;

    set((state) => {
      const { [id]: _, ...groups } = state.groups;
      state.groups = groups;
    });
  },
};

export const useTagGroupsStoreApi = api;
