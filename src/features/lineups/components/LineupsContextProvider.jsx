import { useMemo } from "react";
import {
  useRosterStore,
  useClassTagsStore,
  useTagRulesActiveFilters,
  useTagGroupsStoreApi as tgapi,
} from "@/core/store";
import { findLineupsAsync } from "../find-lineups";
import { useLineupsStore } from "../store.js";
import { LineupsContext } from "../context.js";

const groupTagsOptions = {
  none: undefined,
  level: "level",
  class: "class",
  warden: "warden",
  tag: (id) => tgapi.get(id)?.tags,
};

const getGroupTagsOption = (groupBy) => {
  const [group, ...groupArgs] = groupBy?.split(":") || ["none"];

  return typeof groupTagsOptions[group] === "function"
    ? groupTagsOptions[group](...groupArgs)
    : groupTagsOptions[group];
};

export const LineupsContextProvider = ({ children }) => {
  const lineupsOptions = useLineupsStore((store) => store.options);
  const classTags = useClassTagsStore((store) => store.tags);
  const activeRuleSet = useTagRulesActiveFilters();
  const roster = useRosterStore((store) => store.roster);
  const rules = activeRuleSet?.rules;

  const [targetScore, options] = useMemo(() => {
    const { targetScore, groupBy, ...restOptions } = lineupsOptions;

    return [
      targetScore,
      {
        ...restOptions,
        tagGroups: getGroupTagsOption(groupBy),
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
