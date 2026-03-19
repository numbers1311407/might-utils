import { useMemo } from "react";
import {
  useRosterStore,
  useClassTagsStore,
  useTagRulesActiveFilters,
  useTagGroupsStoreApi as tgapi,
} from "@/core/store";
import { MightMaxLevel, MightMinLevel } from "@/core/config";
import { getNumberedArray } from "@/utils";
import { charClassSchema } from "@/core/schemas";
import { formatTag } from "@/core/tags";
import { findLineupsAsync } from "../find-lineups";
import { useLineupsStore } from "../store.js";
import { LineupsContext } from "../context.js";

const groupTagsOptions = {
  none: undefined,
  level: getNumberedArray(MightMinLevel, MightMaxLevel).map((level) =>
    formatTag(level, { type: "level" }),
  ),
  class: charClassSchema.options.map((cls) =>
    formatTag(cls, { type: "class" }),
  ),
  tag: (id) => tgapi.get(id)?.tags.map(formatTag),
};

export const LineupsContextProvider = ({ children }) => {
  const lineupsOptions = useLineupsStore((store) => store.options);
  const classTags = useClassTagsStore((store) => store.tags);
  const activeRuleSet = useTagRulesActiveFilters();
  const roster = useRosterStore((store) => store.roster);
  const rules = activeRuleSet?.rules;

  const [targetScore, options] = useMemo(() => {
    const { targetScore, groupBy, ...restOptions } = lineupsOptions;
    const [group, groupArg] = groupBy?.split(":") || ["none"];

    const tagGroups =
      typeof groupTagsOptions[group] === "function"
        ? groupTagsOptions[group](groupArg)
        : groupTagsOptions[group];

    return [
      targetScore,
      {
        ...restOptions,
        tagGroups,
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
