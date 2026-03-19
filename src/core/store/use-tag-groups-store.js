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
export const useTagGroupsStoreApi = {
  nameAvailable: (name) => {
    const used = Object.values(get().groups).map((group) =>
      group.name.toLowerCase(),
    );
    return !used.includes(name.toLowerCase());
  },

  restoreDefaultGroup: (id) => {
    const origDefault = defaults[id];

    if (origDefault) {
      useTagGroupsStoreApi.addGroup(origDefault);
    }
  },

  get: (id) => {
    return get().groups[id];
  },

  add: (group, done) => {
    const clone = tagGroupSchema.parse(group);
    const id = clone.id;

    set((state) => {
      state.groups[id] = clone;
      handleDirtyDefaults(clone, state);
    });
    done?.(get().getSet(id));
  },

  remove: (id) => {
    if (id in defaults) return;

    set((state) => {
      delete state.groups[id];
    });
  },
};
