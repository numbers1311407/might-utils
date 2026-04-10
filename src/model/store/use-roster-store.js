import { createStore } from "./helpers";
import { defaultRoster } from "@/config/defaults";
import { useClassTagsStoreApi as classTagsApi } from "./use-class-tags-store.js";
import { rosterSchema, charSchema } from "@/model/schemas";
import { deepEqual } from "fast-equals";
import { getCharsStats } from "./helpers/get-chars-stats.js";

const rosterSort = (a, b) => {
  return a.name.localeCompare(b.name);
};

export const useRosterStore = createStore("might-utils-roster", () => ({
  roster: rosterSchema.parse(defaultRoster).sort(rosterSort),
  activeOnly: false,
}));

const { getState: get, setState: set } = useRosterStore;

const _getChar = (id) => get().roster.find((char) => char.id === id);

const api = {
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
    const { classTags = false } = options;
    const char = _getChar(id);

    if (!classTags) return char;

    return {
      ...char,
      tags: api.getCharTags(char, { charTags: true }),
    };
  },

  updateChar: (id, update, done) => {
    api.addChar({ ...update, id }, done);
  },

  getCharTags: (charId, { classTags = true }) => {
    const char = typeof charId === "string" ? _getChar(charId) : charId;

    if (!char) return [];
    if (!classTags) return char.tags;

    return [
      ...new Set([...classTagsApi.getClassTags(char.class), ...char.tags]),
    ];
  },

  addChar: (char, done) => {
    let clone;

    set((state) => {
      const { roster } = state;
      const idx = roster.findIndex(({ id }) => char.id === id);

      if (idx !== -1) {
        clone = charSchema.parse({ ...roster[idx], ...char });
        roster[idx] = clone;
      } else {
        clone = charSchema.parse(char);
        roster.push(clone);
      }

      state.roster = [...roster].sort(rosterSort);
    });

    done?.(api.getChar(clone.id));
  },

  getStats: (roster) => {
    return getCharsStats(roster);
  },
};

export const useRosterStoreApi = api;
