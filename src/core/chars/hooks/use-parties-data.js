import { useMemo } from "react";
import { useStableCallback } from "@/core/hooks";
import { getPartyCompsMap, getCompStatsMap } from "../helpers";

export const usePartiesData = (parties, selector) => {
  const selectParty = useStableCallback((item) => {
    return selector?.(item) || item;
  });

  return useMemo(() => {
    const comps = getPartyCompsMap(parties, selectParty);
    return { comps, stats: getCompStatsMap(comps) };
  }, [parties, selectParty]);
};
