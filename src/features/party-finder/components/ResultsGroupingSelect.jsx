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
import { usePartyFinderStore } from "../store";

const staticOptions = {
  none: {
    label: "Ungrouped",
    value: "",
  },
  level: {
    label: "By Level & Warden",
    value: "level",
  },
  // NOTE group by class was originally an option and isn't... totally insane,
  // but unless your team has a lot of class duplicates this will lead to
  // many groups. If that seems unintuitive this is because warden and level
  // are *always* considered when generating group slots, so if you have 16
  // chars with different classes, your group count will always equal the
  // result count.
  // class: {
  //   label: "By Class",
  //   value: "class",
  // },
};

export const ResultsGroupingSelect = (props) => {
  const value = usePartyFinderStore(
    (store) => store.options?.groupBy || staticOptions.none.value,
  );
  const [search, setSearch] = useDraftState(value);
  const setOption = usePartyFinderStore((store) => store.setOption);
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
