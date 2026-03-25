import { createStore } from "./helpers";
import { defaultRoster } from "@/core/config/defaults";
import { rosterSchema, charSchema } from "@/core/schemas";

const rosterSort = (a, b) => {
  return a.name.localeCompare(b.name);
};

export const useRosterStore = createStore("might-utils-roster", (set, get) => ({
  roster: rosterSchema.parse(defaultRoster).sort(rosterSort),

  setRoster: (roster = defaultRoster) => {
    set((state) => {
      rosterSchema.parse(roster);
      state.roster = [...roster].sort(rosterSort);
    });
  },

  resetRoster: () => {
    get().setRoster(undefined);
  },

  clearRoster: () => {
    get().setRoster([]);
  },

  removeChar: (char) => {
    const id = typeof char === "string" ? char : char.id;

    set((state) => {
      state.roster = state.roster.filter((char) => char.id !== id);
    });
  },

  getChar: (id) => {
    return get().roster.find((char) => char.id === id);
  },

  updateChar: (id, update, done) => {
    get().addChar({ ...update, id }, done);
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

    done?.(get().getChar(id));
  },
}));
