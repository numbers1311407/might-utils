import { useMemo } from "react";
import { useTagGroupsStoreApi as tgapi } from "@/model/store";
import { useRoster, useRulesActiveFilters } from "@/core/hooks";
import { PartyFinderContext } from "../context.js";
import { useFindPartiesOptionsUrlHydration } from "../hooks.js";
import { usePartyFinderStore } from "../store.js";

const groupByOptions = {
  none: undefined,
  comp: "comp",
  tag: (id) => tgapi.get(id)?.tags,
};

const getGroupByParam = (groupBy) => {
  const [group, ...groupArgs] = groupBy?.split(":") || ["none"];
  const option = groupByOptions[group];
  return typeof option === "function" ? option(...groupArgs) : option;
};

export const PartyFinderContextProvider = ({ children }) => {
  useFindPartiesOptionsUrlHydration();

  const finderOptions = usePartyFinderStore((store) => store.options);
  const rules = useRulesActiveFilters();
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

  const value = {
    options,
    roster,
    targetScore,
    // this is used for the react-query and the error boundary key, YOLO.
    key: JSON.stringify({ options, roster, targetScore }),
  };

  return <PartyFinderContext value={value}>{children}</PartyFinderContext>;
};
