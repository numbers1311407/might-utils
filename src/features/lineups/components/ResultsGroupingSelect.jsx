import { useMemo, useRef } from "react";
import {
  Box,
  CheckIcon,
  Group,
  CloseIcon,
  Combobox,
  useCombobox,
  Input,
  InputBase,
  InputLabel,
  Text,
  Select,
  UnstyledButton,
} from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { useTagGroupsStore } from "@/core/store";
import { useLineupsStore } from "../store";

const staticOptions = {
  none: {
    label: "Ungrouped",
    value: "",
  },
  level: {
    label: "By Level",
    value: "level",
  },
  class: {
    label: "By Class",
    value: "class",
  },
  warden: {
    label: "By Warden Rank",
    value: "warden",
  },
};

export const ResultsGroupingSelect = (props) => {
  const value = useLineupsStore(
    (store) => store.options?.groupBy || staticOptions.none.value,
  );
  const [search, setSearch] = useDraftState(value);
  const setOption = useLineupsStore((store) => store.setOption);
  const groups = useTagGroupsStore((store) => store.registry);
  const combobox = useCombobox();
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
        group: "Tag Groups",
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
