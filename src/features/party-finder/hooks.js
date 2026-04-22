import { use, useCallback, useEffect } from "react";
import { useSearchParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useDraftState } from "@/core/hooks";
import { processComp } from "@/model/schemas/comp";
import { round as utilsRound } from "@/utils";
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

const sd = (array, usePopulation = false) => {
  const n = array.length;
  if (n < 2 && !usePopulation) return 0;

  // 1. Calculate the mean (average)
  const mean = array.reduce((a, b) => a + b) / n;

  // 2. Calculate variance (average of squared differences from mean)
  const variance =
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
    (n - (usePopulation ? 0 : 1));

  // 3. Return square root of variance
  return Math.sqrt(variance);
};

const getStats = (comps) => {
  const round = (v) => utilsRound(v, 3);
  return comps.entries().reduce((map, [comp, compSlots]) => {
    const stats = compSlots.reduce(
      (totals, slot, i) => {
        totals.size += slot.count;
        totals.level += slot.level * slot.count;
        totals.might += slot.might * slot.count;
        totals.warden += slot.warden * slot.count;

        totals.baseMight += slot.baseMight * slot.count;
        totals.wardenMight += (slot.might - slot.baseMight) * slot.count;
        totals.mightRange = [
          Math.min(slot.might, totals.mightRange[0]),
          Math.max(slot.might, totals.mightRange[1]),
        ];

        if (i !== compSlots.length - 1) {
          return totals;
        }

        return {
          size: totals.size,
          score: totals.might,
          avgLevel: round(totals.level / totals.size),
          avgMight: round(totals.might / totals.size),
          avgWarden: round(totals.warden / totals.size),
          pctMightLevel: round((totals.baseMight / totals.might) * 100),
          pctMightWarden: round((totals.wardenMight / totals.might) * 100),
          totalLevel: totals.level,
          totalLevelScore: totals.baseMight,
          totalWardenScore: totals.wardenMight,
          totalWardenRank: totals.warden,
          mightVolatility: totals.mightRange[1] - totals.mightRange[0],
        };
      },
      {
        baseMight: 0,
        size: 0,
        level: 0,
        might: 0,
        warden: 0,
        wardenMight: 0,
        mightRange: [Infinity, 0],
      },
    );

    stats.sdMight = sd(
      compSlots.map((s) => s.might),
      true,
    );

    return map.set(comp, stats);
  }, new Map());
};

const sortParties = (sort, parties, stats) => {
  const sorts = sort.split(" ");
  const lastSort = sorts[sorts.length - 1];

  try {
    return parties.slice().sort((a, b) => {
      for (const sort of sorts) {
        const [_match, rev, field] = sort.match(/^(-)?(\w+)/);

        const compA = stats.get(a.comp);
        const compB = stats.get(b.comp);

        if (compA[field] === compB[field] && sort !== lastSort) {
          continue;
        }

        return (compA[field] - compB[field]) * (rev ? -1 : 1);
      }
    });
  } catch (e) {
    console.error(e);
    return parties.slice();
  }
};

const extractComps = (results) => {
  const pool = results.pool;

  return results.parties.reduce((acc, party) => {
    if (!acc.has(party.comp)) {
      acc.set(
        party.comp,
        processComp(party.comp).map((compSlot) => ({
          ...compSlot,
          slots: new Set(),
        })),
      );
    }

    const compSlots = acc.get(party.comp);

    // collect all pool idxs for chars that match this the comp
    party.party.forEach((idx) => {
      const slot = pool[idx];
      const compItemIdx = compSlots.findIndex((o) => {
        return (
          o.warden === slot.warden &&
          o.level === slot.level &&
          o.terms.every((tag) => slot.tags.includes(tag))
        );
      });
      if (compItemIdx !== -1) compSlots[compItemIdx].slots.add(idx);
    });

    return acc;
  }, new Map());
};

export const useFindPartiesResults = () => {
  const { key, options, roster, targetScore } = use(PartyFinderContext);

  const select = useCallback(
    (data) => {
      return {
        ...data,
        parties: sortParties(options.sort, data.parties, data.stats),
      };
    },
    [options.sort],
  );

  const { data, isPending, error } = useQuery({
    retry: false,
    staleTime: Infinity,
    queryKey: ["find-parties", key],
    select,
    queryFn: async () => {
      return findPartiesAsync(roster, targetScore, options).then((data) => {
        const comps = extractComps(data);
        return {
          ...data,
          comps,
          stats: getStats(comps),
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
