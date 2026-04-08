import { useMemo, useRef, Suspense } from "react";
import { useTagGroupsStoreApi as tgapi } from "@/core/store";
import { useRoster, useTagRulesActiveFilters } from "@/core/hooks";
import { findPartiesAsync } from "../find-parties";
import { usePartyFinderStore } from "../store.js";
import { PartyFinderContext } from "../context.js";

const groupByOptions = {
  none: undefined,
  level: "level",
  class: "class",
  warden: "warden",
  tag: (id) => tgapi.get(id)?.tags,
};

const getGroupByParam = (groupBy) => {
  const [group, ...groupArgs] = groupBy?.split(":") || ["none"];
  const option = groupByOptions[group];
  return typeof option === "function" ? option(...groupArgs) : option;
};

export const PartyFinderContextProvider = ({ children }) => {
  const finderOptions = usePartyFinderStore((store) => store.options);
  const rules = useTagRulesActiveFilters();
  const roster = useRoster({ classTags: true });

  const [targetScore, options] = useMemo(() => {
    const { targetScore, groupBy, ...restOptions } = finderOptions;

    return [
      targetScore,
      {
        ...restOptions,
        groupBy: getGroupByParam(groupBy),
        rules,
      },
    ];
  }, [finderOptions, rules]);

  const resultsPromise = useMemo(
    () => findPartiesAsync(roster, targetScore, options),
    [options, roster, targetScore],
  );

  const valueRef = useRef(0);
  const value = useMemo(() => {
    valueRef.current += 1;
    return {
      options,
      resultsPromise,
      key: `context-key-${valueRef.current}`,
      roster,
      valueRef,
      targetScore,
    };
  }, [options, resultsPromise, roster, targetScore]);

  return (
    <Suspense>
      <PartyFinderContext value={value}>{children}</PartyFinderContext>
    </Suspense>
  );
};
