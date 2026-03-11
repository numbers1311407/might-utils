import { createStore } from "@/common/store";
import { defaultRoster } from "./defaults.js";
import { rosterSchema, charSchema } from "../schema";

const rosterSort = (a, b) => {
  return a.name.localeCompare(b.name);
};

export const useRosterStore = createStore("might-utils-roster", (set, get) => ({
  roster: [...defaultRoster],
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
  addChar: (char) => {
    set((state) => {
      if (!state.roster.find(({ name }) => char.name === name)) {
        charSchema.parse(char);
        state.roster = [...state.roster, char].sort(rosterSort);
      }
    });
  },
  removeChar: (char) => {
    set((state) => {
      if (typeof char === "number") {
        state.roster.splice(char, 1);
      } else if (char?.name) {
        state.roster = state.roster.filter(({ name }) => char.name !== name);
      }
    });
  },
  updateChar: (char, key, value) => {
    const update = typeof key === "string" ? { [key]: value } : key;

    set(({ roster }) => {
      const idx =
        typeof char === "number"
          ? char
          : roster.findIndex(({ name }) => char.name === name);

      if (idx !== -1) {
        roster[idx] = { ...roster[idx], ...update };
      }
    });
  },
}));
