import { createStore } from "./helpers";
import { defaultRoster } from "@/config/defaults";
import { useClassTagsStoreApi as classTagsApi } from "./use-class-tags-store.js";
import { rosterSchema, charSchema } from "@/model/schemas";
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

  setRoster: (roster, cb) => {
    const parsed = rosterSchema.safeParse(roster);
    set((state) => {
      if (parsed.success) {
        state.roster = parsed.data.sort(rosterSort);
      }
    });
    cb?.(parsed);
  },

  resetRoster: () => {
    api.setRoster(defaultRoster);
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

  addChar: (chars, done) => {
    let added = [];

    set((state) => {
      const { roster } = state;

      for (const char of [chars].flat()) {
        const idx = roster.findIndex(({ id }) => char.id === id);
        if (idx !== -1) {
          roster[idx] = charSchema.parse({ ...roster[idx], ...char });
          added.push(roster[idx]);
        } else {
          roster.push(charSchema.parse(char));
          added.push(roster[roster.length - 1]);
        }
      }
      state.roster = rosterSchema.parse(roster).sort(rosterSort);
    });

    const retv = Array.isArray(chars)
      ? added.map((c) => api.getChar(c.id))
      : added.length
        ? api.getChar(added[0].id)
        : undefined;

    done?.(retv);
  },

  addCharTags: (charId, tags) => {
    const char = _getChar(charId);
    if (!char) return;

    api.updateChar(charId, { tags: [...char.tags, ...tags] });
  },

  removeCharTags: (charId, tags) => {
    const char = _getChar(charId);
    if (!char) return;

    api.updateChar(charId, {
      tags: char.tags.filter((t) => !tags.includes(t)),
    });
  },

  getStats: (roster) => {
    return getCharsStats(roster);
  },
};

export const useRosterStoreApi = api;
