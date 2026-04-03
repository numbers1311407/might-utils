import { useMemo } from "react";
import {
  useRosterStore,
  useClassTagsStore,
  useTagRulesActiveFilters,
  useTagGroupsStoreApi as tgapi,
} from "@/core/store";
import { findPartiesAsync } from "../find-parties";
import { usePartyFinderStore } from "../store.js";
import { PartyFinderContext } from "../context.js";

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

export const PartyFinderContextProvider = ({ children }) => {
  const finderOptions = usePartyFinderStore((store) => store.options);
  const classTags = useClassTagsStore((store) => store.tags);
  const activeRuleSet = useTagRulesActiveFilters();
  const roster = useRosterStore((store) => store.roster);
  const rules = activeRuleSet?.rules;

  const [targetScore, options] = useMemo(() => {
    const { targetScore, groupBy, ...restOptions } = finderOptions;

    return [
      targetScore,
      {
        ...restOptions,
        tagGroups: getGroupTagsOption(groupBy),
        rules,
        classTags,
      },
    ];
  }, [classTags, finderOptions, rules]);

  const resultsPromise = useMemo(
    () => findPartiesAsync(roster, targetScore, options),
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

  return <PartyFinderContext value={value}>{children}</PartyFinderContext>;
};
