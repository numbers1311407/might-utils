import { use, useCallback, useEffect } from "react";
import { useSearchParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useDraftState, useSorter } from "@/core/hooks";
import { getPartyCompsMap, getCompStatsMap } from "@/core/chars";

import { PartyFinderContext } from "./context.js";
import { usePartyFinderStore } from "./store.js";
import { findPartiesAsync } from "./find-parties/find-parties-async.js";

export const usePartyFinderOption = (option) => {
  const value = usePartyFinderStore((store) => store.options[option]);
  const [draftValue, setDraftValue] = useDraftState(value);
  const storeSetOption = usePartyFinderStore((store) => store.setOption);
  const setValue = useCallback(
    (value) => {
      setDraftValue(value);
      storeSetOption(option, value);
    },
    [option, setDraftValue, storeSetOption],
  );

  return [draftValue, setValue];
};

export const useFindPartiesResults = () => {
  const { key, options, roster, targetScore } = use(PartyFinderContext);
  const sortParties = useSorter(options.sort);

  const select = useCallback(
    (data) => ({
      ...data,
      parties: sortParties(data.parties, (party) => data.stats.get(party.comp)),
    }),
    [sortParties],
  );

  const { data, isPending, error } = useQuery({
    retry: false,
    staleTime: Infinity,
    queryKey: ["find-parties", key],
    select,
    queryFn: async () => {
      return findPartiesAsync(roster, targetScore, options).then((data) => {
        const comps = getPartyCompsMap(data.parties, (party) => {
          return {
            comp: party.comp,
            chars: Array.from(party.party).map((idx) => data.pool[idx]),
          };
        });

        return {
          ...data,
          comps,
          stats: getCompStatsMap(comps),
        };
      });
    },
  });

  if (isPending) {
    return { isPending };
  }

  // TODO render errors instead of relying on the boundary
  if (error) {
    throw error;
  }

  return data;
};

export function useFindPartiesOptionsUrlHydration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mergeOptions = usePartyFinderStore((state) => state.mergeOptions);

  useEffect(() => {
    if (!searchParams.size) return;
    const params = Object.fromEntries(searchParams.entries());

    mergeOptions(params);
    // Strip the search params from the URL and replace the history state
    // setSearchParams({}, { replace: true });
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, mergeOptions]);
}
