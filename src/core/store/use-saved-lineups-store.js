import { createRegistryStore } from "./helpers";
import { useRosterStoreApi as rosterApi } from "./use-roster-store.js";
import { lineupSchema } from "@/core/schemas";
import { deepEqual } from "fast-equals";

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
    const rosterChar = rosterApi.getChar(charId, true);
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

const extendApi = (_set, _get, api) => ({
  isCharDirty: (partyId, charId) => {
    const char = api.getChar(partyId, charId);
    const rosterChar = rosterApi.getChar(charId, true);
    return !deepEqual(char, rosterChar);
  },

  hasChar: (partyId, charId) => {
    const party = api.get(partyId);
    return (
      !!party && !!charId && party.chars.find((char) => char.id === charId)
    );
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
});

const { useStore, api } = createRegistryStore(
  "might-utils-saved-lineups",
  lineupSchema,
  {
    extendApi,
  },
);

export { useStore as useSavedLineupsStore, api as useSavedLineupsStoreApi };
