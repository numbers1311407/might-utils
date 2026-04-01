import { useMemo } from "react";
import { createStore } from "./helpers";
import { defaultRoster } from "@/core/config/defaults";
import { rosterSchema, charSchema } from "@/core/schemas";
import { useClassTagsStore } from "./use-class-tags-store.js";

const getClassTags = (cls) => useClassTagsStore.getState().getClassTags(cls);

const rosterSort = (a, b) => {
  return a.name.localeCompare(b.name);
};

const prepareCharTags = (char) => {
  const classTags = getClassTags(char.class);
  const tags = [...new Set([...char.tags, ...classTags])];
  const result = charSchema.safeParse({ ...char, tags });
  return result.data;
};

export const useRosterStore = createStore("might-utils-roster", () => ({
  roster: rosterSchema.parse(defaultRoster).sort(rosterSort),
  activeOnly: false,
}));

const { getState: get, setState: set } = useRosterStore;

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

  getChar: (id, withClassTags = false) => {
    const char = get().roster.find((char) => char.id === id);

    if (!char || !withClassTags) {
      return char;
    } else {
      return prepareCharTags(char);
    }
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

export const useRoster = () => {
  const roster = useRosterStore((store) => store.roster);
  const activeOnly = useRosterStore((store) => store.activeOnly);

  const filteredRoster = useMemo(() => {
    return roster.filter((char) => (activeOnly ? char.active : true));
  }, [roster, activeOnly]);

  return {
    roster: filteredRoster,
    activeOnly,
    setActiveOnly: api.setActiveOnly,
  };
};
