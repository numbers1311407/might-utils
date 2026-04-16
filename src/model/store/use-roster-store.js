import { createStore } from "./helpers";
import { defaultRoster } from "@/config/defaults";
import { useClassTagsStoreApi as classTagsApi } from "./use-class-tags-store.js";
import { rosterSchema, charSchema } from "@/model/schemas";
import { getCharsStats } from "./helpers/get-chars-stats.js";
import { getCharMight } from "@/config/chars/might";

const rosterSort = (a, b) => {
  return a.name.localeCompare(b.name);
};

export const useRosterStore = createStore("might-utils-roster", () => ({
  roster: rosterSchema.parse(defaultRoster).sort(rosterSort),
  activeOnly: false,
}));

const { getState: get, setState: set } = useRosterStore;

const _getChar = (name) => get().roster.find((char) => char.name === name);

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

  removeChar: (chars) => {
    set((state) => {
      for (const char of [chars].flat()) {
        const name = typeof char === "string" ? char : char.name;
        state.roster = state.roster.filter((char) => char.name !== name);
      }
    });
  },

  getChar: (name, options = {}) => {
    const { classTags = true } = options;
    const char = _getChar(name);

    if (!char) {
      return undefined;
    }

    return {
      ...char,
      might: getCharMight(char),
      tags: !classTags ? char.tags : api.getCharTags(char, { classTags }),
    };
  },

  updateChar: (name, update, done) => {
    api.addChar({ ...update, _name: name }, done);
  },

  getCharTags: (name, { classTags = true }) => {
    const char = typeof name === "string" ? _getChar(name) : name;

    if (!char) return [];
    if (!classTags) return char.tags;

    return [
      ...new Set([...classTagsApi.getClassTags(char.class), ...char.tags]),
    ];
  },

  syncChars: (chars) => {
    const roster = get().roster;
    const charNames = chars.map((char) => char.name);
    api.addChar(chars);
    api.removeChar(roster.filter((char) => !charNames.includes(char.name)));
  },

  addChar: (chars, done) => {
    let added = [];

    set((state) => {
      const { roster } = state;

      for (const _char of [chars].flat()) {
        const name = _char._name || _char.name;
        const { _name, ...char } = _char;
        const idx = roster.findIndex((c) => c.name === name);

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

    // the callback value here is an array or single character depending
    // on whether the function was sent an array or single char
    const retv = Array.isArray(chars)
      ? added.map((c) => api.getChar(c.name))
      : added.length
        ? api.getChar(added[0].name)
        : undefined;

    done?.(retv);
  },

  addCharTags: (name, tags) => {
    const char = _getChar(name);
    if (!char) return;

    api.updateChar(name, { tags: [...char.tags, ...tags] });
  },

  removeCharTags: (name, tags) => {
    const char = _getChar(name);
    if (!char) return;

    api.updateChar(name, {
      tags: char.tags.filter((t) => !tags.includes(t)),
    });
  },

  getStats: (roster) => {
    return getCharsStats(
      roster || get().roster.map((char) => api.getChar(char.name)),
    );
  },
};

export const useRosterStoreApi = api;
