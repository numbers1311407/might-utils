import { createStore } from "./helpers";
import { defaultRoster } from "@/core/config/defaults";
import { useClassTagsStoreApi as classTagsApi } from "./use-class-tags-store.js";
import { rosterSchema, charSchema } from "@/core/schemas";
import { deepEqual } from "fast-equals";

const rosterSort = (a, b) => {
  return a.name.localeCompare(b.name);
};

export const useRosterStore = createStore("might-utils-roster", () => ({
  roster: rosterSchema.parse(defaultRoster).sort(rosterSort),
  activeOnly: false,
}));

const { getState: get, setState: set } = useRosterStore;

const api = {
  isCharDirty: (char, options = { classTags: false }) => {
    const rosterChar = api.getChar(char.id, options);
    return deepEqual(char, rosterChar);
  },

  setActiveOnly: (value) => {
    set((state) => {
      state.activeOnly = value;
    });
  },

  toggleActiveOnly: () => {
    api.setActiveOnly(!get().activeOnly);
  },

  setRoster: (roster = defaultRoster) => {
    set((state) => {
      state.roster = rosterSchema.parse(roster).sort(rosterSort);
    });
  },

  resetRoster: () => {
    api.setRoster(undefined);
  },

  clearRoster: () => {
    api.setRoster([]);
  },

  removeChar: (char) => {
    const id = typeof char === "string" ? char : char.id;

    set((state) => {
      state.roster = state.roster.filter((char) => char.id !== id);
    });
  },

  getChar: (id, options = {}) => {
    const { classTags = true } = options;
    const char = get().roster.find((char) => char.id === id);

    if (!classTags) return char;

    return {
      ...char,
      tags: [
        ...new Set([...classTagsApi.getClassTags(char.class), ...char.tags]),
      ],
    };
  },

  updateChar: (id, update, done) => {
    api.addChar({ ...update, id }, done);
  },

  addChar: (char, done) => {
    const id = char.id;

    set((state) => {
      const { roster } = state;
      const idx = roster.findIndex(({ id }) => char.id === id);

      if (idx !== -1) {
        roster[idx] = charSchema.parse({ ...roster[idx], ...char });
      } else {
        roster.push(charSchema.parse(char));
      }

      state.roster = [...roster].sort(rosterSort);
    });

    done?.(api.getChar(id));
  },
};

export const useRosterStoreApi = api;
