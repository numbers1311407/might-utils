import { useCallback, useMemo } from "react";
import {
  usePartiesStore,
  usePartiesStoreApi as partiesStore,
  useRosterStoreApi as rosterApi,
} from "@/model/store";

export const useParty = (paramPartyId, options = {}) => {
  const { defaultToFirst, classTags = true } = options;
  const partyRegistry = usePartiesStore((store) => store.registry);

  const party = useMemo(() => {
    const keys = Object.keys(partyRegistry);

    if (!keys.length) return;

    const party =
      (paramPartyId && partyRegistry[paramPartyId]) ||
      (defaultToFirst && partyRegistry[keys[0]]);

    if (!party || !classTags) return party;

    return {
      ...party,
      chars: party.chars.map((char) => ({
        ...char,
        tags: rosterApi.getCharTags(char.name, { classTags: true }),
      })),
    };
  }, [classTags, paramPartyId, partyRegistry, defaultToFirst]);

  const partyId = party?.id;

  const dirtyChars = useMemo(() => {
    return partiesStore.getDirtyStatus(party?.id);
  }, [party]);

  const stats = useMemo(() => {
    return partiesStore.getStats(party?.id);
  }, [party]);

  const addChar = useCallback(
    (name) => {
      if (partyId) {
        partiesStore.addChar(partyId, name);
      }
    },
    [partyId],
  );

  const isCharDirty = useCallback(
    (name) => {
      if (party?.id) {
        return partiesStore.isCharDirty(party.id, name);
      }
    },
    [party],
  );

  const copyParty = useCallback(
    (done) => {
      if (party) partiesStore.copy(party, done);
    },
    [party],
  );

  const removeParty = useCallback(
    (done) => {
      if (partyId) partiesStore.remove(partyId, done);
    },
    [partyId],
  );

  const hasChar = useCallback(() => {
    if (party?.id) return partiesStore.hasChar(party.id, name);
  }, [party]);

  const updateChar = useCallback(
    (name, update) => {
      if (partyId) partiesStore.updateChar(partyId, name, update);
    },
    [partyId],
  );

  const resetChar = useCallback(
    (name) => {
      if (partyId) partiesStore.resetChar(partyId, name);
    },
    [partyId],
  );

  const resetChars = useCallback(() => {
    if (partyId) partiesStore.resetChars(partyId);
  }, [partyId]);

  const getChar = useCallback(
    (name) => {
      if (partyId) partiesStore.getChar(partyId, name);
    },
    [partyId],
  );

  const removeChar = useCallback(
    (name, done) => {
      if (partyId) partiesStore.removeChar(partyId, name, done);
    },
    [partyId],
  );

  const saveSnapshot = useCallback(
    (done) => {
      if (partyId) partiesStore.saveSnapshot(partyId, done);
    },
    [partyId],
  );

  const restoreSnapshot = useCallback(
    (done) => {
      if (partyId) partiesStore.restoreSnapshot(partyId, done);
    },
    [partyId],
  );

  const snapshotDirty = useMemo(() => {
    return !party?.id || partiesStore.isSnapshotDirty(party.id);
  }, [party]);

  const hasSnapshot = useMemo(() => {
    return !!party?.id && partiesStore.hasSnapshot(party.id);
  }, [party]);

  return {
    addChar,
    copyParty,
    dirtyChars,
    getChar,
    hasChar,
    isCharDirty,
    party,
    partyId,
    saveSnapshot,
    snapshotDirty,
    hasSnapshot,
    restoreSnapshot,
    removeChar,
    removeParty,
    resetChar,
    resetChars,
    stats,
    updateChar,
  };
};
