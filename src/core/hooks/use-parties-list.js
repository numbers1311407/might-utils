import { useMemo } from "react";
import {
  usePartiesStore,
  usePartiesStoreApi as partiesStore,
} from "@/model/store";

export const usePartiesList = (options = {}) => {
  const { hydrate = false, classTags = false } = options;
  const registry = usePartiesStore((store) => store.registry);

  return useMemo(() => {
    const parties = Object.values(registry);
    return hydrate
      ? parties.map((party) => partiesStore.hydrateParty(party, { classTags }))
      : parties;
  }, [classTags, registry, hydrate]);
};
