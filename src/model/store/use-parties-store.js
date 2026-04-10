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
    const rosterChar = rosterApi.getChar(charId);

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

const extendApi = (_set, get, api) => {
  const extApi = {
    // *super override*
    // when copying or creating a party, set the snapshot to
    // be the chars at the time of creation.
    getCopy: (record, keepId) => {
      const copy = api.getCopy(record, keepId);
      return structuredClone({ ...copy, snapshot: copy.chars });
    },

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
      const rosterChar = rosterApi.getChar(charId, { classTags: false });

      // We allow roster chars to be deleted without pulling them from parties
      // in which they're referenced. This is... by design? Since the parties
      // are in part historical reference and there's no reason (outside loss
      // of upstream tags to reference) why the roster char needs to be removed.
      // This is also probably an edge case, it's likely rare that roster
      // members will be deleted.
      //
      // And even if they are, leaving incomplete parties isn't useful.
      if (!rosterChar) {
        return false;
      }

      return !deepEqual(extApi.getChar(partyId, charId), rosterChar);
    },

    isSnapshotDirty: (partyId) => {
      const party = api.get(partyId);
      return !party || !deepEqual(party.chars, party.snapshot);
    },

    hasSnapshot: (partyId) => {
      const party = api.get(partyId);
      return !!party && party.snapshot.length !== 0;
    },

    getDirtyStatus: (partyId) => {
      const party = api.get(partyId);

      return (party?.chars || []).reduce((acc, char) => {
        if (extApi.isCharDirty(party.id, char.id)) acc.add(char.id);
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

    saveSnapshot: getConfirmation(
      (partyId, done) => {
        const party = api.get(partyId);
        api.add({ ...party, snapshot: party.chars }, done);
      },
      {
        title: "Save a new snapshot?",
        message:
          "This will save the current state of your party so you " +
          "can restore it easily after making edits to characters. This " +
          "will delete the previous snapshot if one exists.",
      },
    ),

    restoreSnapshot: getConfirmation(
      (partyId, done) => {
        const party = api.get(partyId);
        api.add({ ...party, chars: party.snapshot }, done);
      },
      {
        title: "Restore saved snapshot?",
        message:
          "This will delete any changes you've made since the party was " +
          "created or the last snapshot was saved.",
      },
    ),

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
      const char = extApi.getChar(partyId, charId);

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
        extApi.addChar(partyId, charId);
      },
      {
        message:
          "This will resync this character with their roster version, " +
          "reverting any changes made to level or warden rank.",
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
          "reverting any changes made to level or warden rank.",
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
      const taggedChars = chars.map((char) => ({
        ...char,
        tags: rosterApi.getCharTags(char.id, { classTags: true }),
      }));
      return getCharsStats(taggedChars);
    },
  };

  return extApi;
};

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
