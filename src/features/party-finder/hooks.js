import { use, useEffect } from "react";
import { useSearchParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { processComp } from "@/model/schemas/comp";
import { PartyFinderContext } from "./context.js";
import { usePartyFinderStore } from "./store.js";
import { findPartiesAsync } from "./find-parties/find-parties-async.js";

const extractGroups = (results) => {
  const pool = results.pool;

  return Array.from(
    results.parties
      .reduce((acc, party) => {
        if (!acc.has(party.comp)) {
          const comp = processComp(party.comp);
          acc.set(party.comp, {
            compStr: party.comp,
            compSlotMap: comp.map(() => new Set()),
            comp,
            parties: [],
          });
        }
        const { comp, parties, compSlotMap } = acc.get(party.comp);

        parties.push({
          ...party,
          party: Array.from(party.party),
        });

        // collect all pool idxs for chars that match this the comp
        party.party.forEach((idx) => {
          const slot = pool[idx];
          const compItemIdx = comp.findIndex((o) => {
            return (
              o.warden === slot.warden &&
              o.level === slot.level &&
              o.terms.every((tag) => slot.tags.includes(tag))
            );
          });
          if (compItemIdx !== -1) compSlotMap[compItemIdx].add(idx);
        });

        return acc;
      }, new Map())
      .values(),
  );
};

export const useFindPartiesResults = () => {
  const { key, options, roster, targetScore } = use(PartyFinderContext);

  const { data, isPending, error } = useQuery({
    retry: false,
    staleTime: Infinity,
    queryKey: ["find-parties", key],
    queryFn: async () => {
      return findPartiesAsync(roster, targetScore, options).then((data) => {
        return {
          ...data,
          groups: data.groupBy && extractGroups(data),
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
