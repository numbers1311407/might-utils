import { createRegistryStore } from "./helpers";
import { useRosterStoreApi as rosterApi } from "./use-roster-store.js";
import { partySchema } from "@/core/schemas";
import { getCharMight } from "@/core/chars";
import { deepEqual } from "fast-equals";
import { sum, round } from "@/utils";

// super overloaded for little good reason
// ---
// value can be a string ID (add case)
// value can be an object (update cased)
// value can be an array of both (reset case, mainly)
const _addOrUpdateChar = (partyId, value, api) => {
  const party = api.get(partyId);
  const chars = [...party.chars];

  let updated = false;

  [value].flat().forEach((char) => {
    const isId = typeof char === "string";
    const charId = isId ? char : char?.id;
    const rosterChar = rosterApi.getChar(charId, { classTags: true });
    const charToAdd = structuredClone(isId ? rosterChar : char);

    if (
      !party ||
      !rosterChar ||
      rosterChar.name !== charToAdd.name ||
      rosterChar.id !== charToAdd.id
    ) {
      return;
    }

    updated = true;

    const idx = chars.findIndex((char) => char.id === charId);

    if (idx === -1) {
      chars.push(charToAdd);
    } else {
      chars.splice(idx, 1, charToAdd);
    }
  });

  if (updated) {
    api.add({ ...party, chars });
  }
};

const extendApi = (_set, get, api) => ({
  getFirst: () => {
    const { registry } = get();
    const ids = Object.keys(registry);
    return ids.length ? registry[ids[0]] : undefined;
  },

  hasChar: (partyId, charId) => {
    const party = api.get(partyId);
    return (
      !!party && !!charId && party.chars.find((char) => char.id === charId)
    );
  },

  isCharDirty: (partyId, charId) => {
    return !deepEqual(
      api.getChar(partyId, charId),
      rosterApi.getChar(charId, { classTags: true }),
    );
  },

  getDirtyStatus: (partyId) => {
    const party = api.get(partyId);

    return (party?.chars || []).reduce((acc, char) => {
      if (api.isCharDirty(party.id, char.id)) acc.add(char.id);
      return acc;
    }, new Set());
  },

  getChar: (partyId, charId) => {
    const party = api.get(partyId);
    return party && party.chars.find((char) => char.id === charId);
  },

  addChar: (partyId, charId) => {
    if (typeof charId === "string") {
      _addOrUpdateChar(partyId, charId, api);
    }
  },

  removeChar: (partyId, char) => {
    const charId = typeof char === "string" ? char : char?.id;
    const party = api.get(partyId);
    const hasChar = party.chars.some((char) => char.id === charId);

    if (!party || !hasChar) return;

    api.add({
      ...party,
      chars: party.chars.filter((char) => char.id !== charId),
    });
  },

  updateChar: (partyId, charId, update) => {
    const char = api.getChar(partyId, charId);

    if (!char || typeof update !== "object") return;

    // strip off class and name from the update object in case
    // they someone made it through
    const { class: _c, name: _n, ...restUpdate } = update;

    // if that leaves any props, merge it with the existing
    // char and send it back in.
    if (Object.keys(restUpdate).length) {
      _addOrUpdateChar(partyId, { ...char, ...restUpdate }, api);
    }
  },

  resetChar: (partyId, char) => {
    const charId = typeof char === "string" ? char : char?.id;
    api.addChar(partyId, charId);
  },

  resetChars: (partyId) => {
    const party = api.get(partyId);
    const ids = party.chars.map((char) => char.id);
    _addOrUpdateChar(partyId, ids, api);
  },

  getMight: (partyId) => {
    const party = api.get(partyId);
    return party?.chars
      ? sum(party.chars.map((char) => getCharMight(char)))
      : 0;
  },

  getStats: (partyId) => {
    const party = api.get(partyId);
    const acc = {
      size: party?.chars.length,
      might: { avg: 0, min: 0, max: 0, total: 0, chars: {}, counts: {} },
      level: { avg: 0, min: 0, max: 0, total: 0, chars: {}, counts: {} },
      warden: { avg: 0, min: 0, max: 0, total: 0, chars: {}, counts: {} },
      class: { chars: {}, counts: {} },
      tags: { count: 0, chars: {}, counts: {} },
    };

    const t = (char) => ({ id: char.id, name: char.name });
    const counts = (chars) =>
      Object.entries(chars).reduce(
        (counts, [v, t]) => (counts[v] = t.length) && counts,
        {},
      );

    return (party?.chars || []).reduce((acc, char, i) => {
      const rchar = rosterApi.getChar(char.id, { classTags: true });
      const rtags = rchar?.tags || [];

      // level
      acc.level.total += char.level;
      acc.level.min = Math.min(char.level, acc.level.min || char.level);
      acc.level.max = Math.max(char.level, acc.level.max);
      acc.level.chars[char.level] ||= [];
      acc.level.chars[char.level].push(t(char));

      // warden
      acc.warden.total += char.warden;
      acc.warden.min = Math.min(char.warden, acc.warden.min);
      acc.warden.max = Math.max(char.warden, acc.warden.max);
      acc.warden.chars[char.warden] ||= [];
      acc.warden.chars[char.warden].push(t(char));

      // might
      const might = getCharMight(char);
      acc.might.total += might;
      acc.might.min = Math.min(might, acc.might.min || might);
      acc.might.max = Math.max(might, acc.might.max);
      acc.might.chars[might] ||= [];
      acc.might.chars[might].push(t(char));

      // class
      acc.class.chars[char.class] ||= [];
      acc.class.chars[char.class].push(t(char));

      // tags
      acc.tags.count += rtags.length;
      for (const tag of rtags) {
        acc.tags.chars[tag] ||= [];
        acc.tags.chars[tag].push(t(char));
      }

      if (i < party.chars.length - 1) {
        return acc;
      }

      acc.might.avg = round(acc.might.total / acc.size, 2);
      acc.level.avg = round(acc.level.total / acc.size, 2);
      acc.warden.avg = round(acc.warden.total / acc.size, 2);
      acc.class.counts = counts(acc.class.chars);
      acc.level.counts = counts(acc.level.chars);
      acc.warden.counts = counts(acc.warden.chars);
      acc.might.counts = counts(acc.might.chars);
      acc.tags.counts = counts(acc.tags.chars);

      return acc;
    }, acc);
  },
});

const { useStore, api } = createRegistryStore(
  "might-utils-parties",
  partySchema,
  {
    extendApi,
  },
);

export { useStore as usePartiesStore, api as usePartiesStoreApi };
