import { useMemo } from "react";
import { useClassTagsStore, useTagRulesStore } from "@/common/tags/store";
import { LineupsContext } from "../context.js";
import { findLineupsAsync } from "../find-lineups-async.js";
import { useLineupsStore } from "../store.js";
import { useRosterStore } from "@/features/roster";

export const LineupsContextProvider = ({ children }) => {
  const lineupsOptions = useLineupsStore((store) => store.options);
  const classTags = useClassTagsStore((store) => store.tags);
  const rules = useTagRulesStore((store) => store.rules);
  const roster = useRosterStore((store) => store.roster);

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
