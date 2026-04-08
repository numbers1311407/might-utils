import { useCallback, useMemo } from "react";
import {
  useConfirmationStore,
  usePartiesStore,
  usePartiesStoreApi as partiesApi,
} from "@/core/store";

// TODO a fun refactor would be to tie this hook and store hooks like it
// to the modal editor for hte party. It would require a global modal service
// like confirmations. The hook+modal combo would take care of everything
// related to editing the party and just make callbacks on completion.
export const useParty = (partyId, options = {}) => {
  const { getConfirmation } = useConfirmationStore();
  const { defaultToFirst } = options;
  const partyRegistry = usePartiesStore((store) => store.registry);

  const party = useMemo(() => {
    const keys = Object.keys(partyRegistry);

    if (!keys.length) return;

    return (
      (partyId && partyRegistry[partyId]) ||
      (defaultToFirst && partyRegistry[keys[0]])
    );
  }, [partyId, partyRegistry, defaultToFirst]);

  const dirtyChars = useMemo(() => {
    return partiesApi.getDirtyStatus(party?.id);
  }, [party]);

  const stats = useMemo(() => {
    return partiesApi.getStats(party?.id);
  }, [party]);

  const addChar = useCallback(
    (charId) => {
      if (party?.id) {
        partiesApi.addChar(party.id, charId);
      }
    },
    [party],
  );

  const isCharDirty = useCallback(
    (charId) => {
      if (party?.id) {
        return partiesApi.isCharDirty(party.id, charId);
      }
    },
    [party],
  );

  const hasChar = useCallback(() => {
    if (party?.id) {
      return partiesApi.hasChar(party.id, charId);
    }
  }, [party]);

  const updateChar = useCallback(
    (charId, update) => {
      if (party?.id) {
        partiesApi.updateChar(party.id, charId, update);
      }
    },
    [party],
  );

  const resetChar = useCallback(
    (charId) => {
      if (party?.id) {
        partiesApi.reseChar(party?.id, charId);
      }
    },
    [party],
  );

  const resetChars = useCallback(() => {
    if (party?.id) {
      partiesApi.resetChars(party?.id);
    }
  }, [party]);

  const getChar = useCallback(
    (charId) => {
      if (party?.id) {
        partiesApi.getChar(party?.id, charId);
      }
    },
    [party],
  );

  const removeChar = useMemo(() => {
    return (charId) => {
      if (party?.id) {
        const char = partiesApi.getChar(party.id, charId);
        const title = `Are you sure you want to remove the ${char.name} from the party?`;

        return getConfirmation(
          () => {
            partiesApi.removeChar(party.id, charId);
          },
          { title },
        );
      }
    };
  }, [party]);

  return {
    addChar,
    dirtyChars,
    getChar,
    hasChar,
    isCharDirty,
    party,
    partyId: party?.id,
    removeChar,
    resetChar,
    resetChars,
    stats,
    updateChar,
  };
};
