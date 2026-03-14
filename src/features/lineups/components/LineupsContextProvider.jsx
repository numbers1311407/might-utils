import { useMemo } from "react";
import {
  useRosterStore,
  useClassTagsStore,
  useTagRulesActiveFilters,
} from "@/core/store";

import { useLineupsStore } from "../store.js";
import { LineupsContext } from "../context.js";
import { findLineupsAsync } from "../find-lineups-async.js";

export const LineupsContextProvider = ({ children }) => {
  const lineupsOptions = useLineupsStore((store) => store.options);
  const classTags = useClassTagsStore((store) => store.tags);
  const activeRuleSet = useTagRulesActiveFilters();
  const roster = useRosterStore((store) => store.roster);
  const rules = activeRuleSet?.rules;

  const [targetScore, options] = useMemo(() => {
    const { targetScore, ...restOptions } = lineupsOptions;
    return [
      targetScore,
      {
        ...restOptions,
        rules,
        classTags,
      },
    ];
  }, [classTags, lineupsOptions, rules]);

  const resultsPromise = useMemo(
    () => findLineupsAsync(roster, targetScore, options),
    [options, roster, targetScore],
  );

  const value = useMemo(
    () => ({
      options,
      resultsPromise,
      roster,
      targetScore,
    }),
    [options, resultsPromise, roster, targetScore],
  );

  return <LineupsContext value={value}>{children}</LineupsContext>;
};
