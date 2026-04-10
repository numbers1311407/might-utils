import { useCallback, useMemo } from "react";
import {
  usePartiesStore,
  usePartiesStoreApi as partiesApi,
  useRosterStoreApi as rosterApi,
} from "@/model/store";

// TODO a fun refactor would be to tie this hook and store hooks like it
// to the modal editor for hte party. It would require a global modal service
// like confirmations. The hook+modal combo would take care of everything
// related to editing the party and just make callbacks on completion.
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
        tags: rosterApi.getCharTags(char.id, { classTags: true }),
      })),
    };
  }, [classTags, paramPartyId, partyRegistry, defaultToFirst]);

  const partyId = party?.id;

  const dirtyChars = useMemo(() => {
    return partiesApi.getDirtyStatus(party?.id);
  }, [party]);

  const stats = useMemo(() => {
    return partiesApi.getStats(party?.id);
  }, [party]);

  const addChar = useCallback(
    (charId) => {
      if (partyId) {
        partiesApi.addChar(partyId, charId);
      }
    },
    [partyId],
  );

  const isCharDirty = useCallback(
    (charId) => {
      if (party?.id) {
        return partiesApi.isCharDirty(party.id, charId);
      }
    },
    [party],
  );

  const copyParty = useCallback(
    (done) => {
      if (party) partiesApi.copy(party, done);
    },
    [party],
  );

  const removeParty = useCallback(
    (done) => {
      if (partyId) partiesApi.remove(partyId, done);
    },
    [partyId],
  );

  const hasChar = useCallback(() => {
    if (party?.id) return partiesApi.hasChar(party.id, charId);
  }, [party]);

  const updateChar = useCallback(
    (charId, update) => {
      if (partyId) partiesApi.updateChar(partyId, charId, update);
    },
    [partyId],
  );

  const resetChar = useCallback(
    (charId) => {
      if (partyId) partiesApi.resetChar(partyId, charId);
    },
    [partyId],
  );

  const resetChars = useCallback(() => {
    if (partyId) partiesApi.resetChars(partyId);
  }, [partyId]);

  const getChar = useCallback(
    (charId) => {
      if (partyId) partiesApi.getChar(partyId, charId);
    },
    [partyId],
  );

  const removeChar = useCallback(
    (charId, done) => {
      if (partyId) partiesApi.removeChar(partyId, charId, done);
    },
    [party],
  );

  return {
    addChar,
    copyParty,
    dirtyChars,
    getChar,
    hasChar,
    isCharDirty,
    party,
    partyId: party?.id,
    removeChar,
    removeParty,
    resetChar,
    resetChars,
    stats,
    updateChar,
  };
};
