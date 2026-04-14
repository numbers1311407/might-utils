import { useMemo, useRef } from "react";
import { Select } from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { useTagGroupsStore } from "@/model/store";
import { usePartyFinderStore } from "../store";

const staticOptions = {
  none: {
    label: "Ungrouped",
    value: "none",
  },
  level: {
    label: "By Level & Warden",
    value: "comp",
  },
};

export const ResultsGroupingSelect = () => {
  const value = usePartyFinderStore(
    (store) => store.options?.groupBy || staticOptions.none.value,
  );
  const [search, setSearch] = useDraftState(value);
  const setOption = usePartyFinderStore((store) => store.setOption);
  const groups = useTagGroupsStore((store) => store.registry);
  const ref = useRef();

  const activeGroupOptions = useMemo(() => {
    return Object.values(groups)
      .filter((group) => group.active)
      .map((group) => ({
        label: group.name,
        value: `tag:${group.id}`,
      }));
  }, [groups]);

  const data = useMemo(() => {
    return [
      {
        group: "Standard",
        items: Object.values(staticOptions),
      },
      {
        group: "Grouping Tags",
        items: activeGroupOptions,
      },
    ];
  }, [activeGroupOptions]);

  return (
    <Select
      allowDeselect={false}
      clearable
      data={data}
      label="Results Grouping"
      onSearchChange={setSearch}
      placeholder="Select grouping..."
      ref={ref}
      searchValue={search}
      searchable
      value={value}
      onFocus={() => {
        setSearch("");
      }}
      onChange={(value) => {
        setOption("groupBy", value || null);
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
    />
  );
};
