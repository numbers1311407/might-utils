import { createRegistryStore } from "./helpers";
import { useRosterStoreApi as rosterApi } from "./use-roster-store.js";
import { getConfirmation } from "./use-confirmation-store.js";
import { partySchema } from "@/model/schemas";
import { getCharMight } from "@/config/chars";
import { deepEqual } from "fast-equals";
import { sum } from "@/utils";
import { getCharsStats } from "./helpers/get-chars-stats.js";

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

  removeChar: getConfirmation(
    (partyId, char, done) => {
      const charId = typeof char === "string" ? char : char?.id;
      const party = api.get(partyId);
      const hasChar = party.chars.some((char) => char.id === charId);

      if (!party || !hasChar) return;

      api.add({
        ...party,
        chars: party.chars.filter((char) => char.id !== charId),
      });

      done?.();
    },
    {
      title: "Are you sure you want to remove this character from the party?",
      message: "They will still be avaiable to re-add from the roster.",
    },
  ),

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

  resetChar: getConfirmation(
    (partyId, char) => {
      const charId = typeof char === "string" ? char : char?.id;
      api.addChar(partyId, charId);
    },
    {
      message:
        "This will resync this character with their roster version, " +
        "reverting any changes to level, warden, and tags.",
    },
  ),

  resetChars: getConfirmation(
    (partyId) => {
      const party = api.get(partyId);
      const ids = party.chars.map((char) => char.id);
      _addOrUpdateChar(partyId, ids, api);
    },
    {
      message:
        "This will resync all characters with their roster versions, " +
        "reverting any changes to level, warden, and tags.",
    },
  ),

  getMight: (partyId) => {
    const party = api.get(partyId);
    return party?.chars
      ? sum(party.chars.map((char) => getCharMight(char)))
      : 0;
  },

  getStats: (partyId) => {
    const { chars = [] } = api.get(partyId) || {};
    return getCharsStats(chars);
  },
});

const { useStore, api } = createRegistryStore(
  "might-utils-parties",
  partySchema,
  {
    getConfirmation,
    recordName: "party",
    extendApi,
  },
);

export { useStore as usePartiesStore, api as usePartiesStoreApi };
