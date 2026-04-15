import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  usePartiesStore,
  usePartiesStoreApi as partiesStore,
} from "@/model/store";

export const useParty = (partyId, options = {}) => {
  const { classTags = true } = options;
  const storeParty = usePartiesStore(
    useShallow((store) => store.registry[partyId]),
  );

  const party = useMemo(() => {
    return storeParty && partiesStore.hydrateParty(storeParty, { classTags });
  }, [classTags, storeParty]);

  const stats = useMemo(() => {
    return partiesStore.getStats(party);
  }, [party]);

  const addChar = useCallback(
    (name) => {
      if (partyId) {
        partiesStore.addChar(partyId, name);
      }
    },
    [partyId],
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

  const hasChar = useCallback(
    (name) => {
      if (party?.id) return partiesStore.hasChar(party.id, name);
    },
    [party],
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

  const updateChar = useCallback(
    (name, update) => {
      if (partyId) partiesStore.updateChar(partyId, name, update);
    },
    [partyId],
  );

  return {
    addChar,
    copyParty,
    getChar,
    hasChar,
    party,
    removeChar,
    removeParty,
    resetChar,
    resetChars,
    stats,
    updateChar,
  };
};
