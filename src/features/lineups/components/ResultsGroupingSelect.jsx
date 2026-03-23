import { useMemo } from "react";
import {
  Box,
  Combobox,
  useCombobox,
  Input,
  InputBase,
  InputLabel,
} from "@mantine/core";
import { useTagGroupsStore } from "@/core/store";
import { useLineupsStore } from "../store";

const staticOptions = {
  none: {
    label: "Ungrouped",
    value: "none",
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
    label: "By Warden Rk.",
    value: "warden",
  },
};

export const ResultsGroupingSelect = (props) => {
  const value = useLineupsStore(
    (store) => store.options?.groupBy || staticOptions.none.value,
  );
  const setOption = useLineupsStore((store) => store.setOption);
  const groups = useTagGroupsStore((store) => store.registry);
  const combobox = useCombobox();

  const activeGroupOptions = useMemo(() => {
    return Object.values(groups)
      .filter((group) => group.active)
      .map((group) => ({
        label: group.name,
        value: `tag:${group.id}`,
      }));
  }, [groups]);

  const valueLabel = useMemo(() => {
    for (const option of Object.values(staticOptions)) {
      if (value === option.value) {
        return value === staticOptions.none.value
          ? staticOptions.none.label
          : `Standard: ${option.label}`;
      }
    }
    for (const option of activeGroupOptions) {
      if (value === option.value) {
        return `Tag: ${option.label}`;
      }
    }
    return staticOptions.none.label;
  }, [value, activeGroupOptions]);

  return (
    <Box {...props}>
      <InputLabel>Results Grouping</InputLabel>
      <Combobox
        onOptionSubmit={({ value }) => {
          setOption("groupBy", value);
          combobox.closeDropdown();
        }}
        store={combobox}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
          >
            {valueLabel || (
              <Input.Placeholder>Choose grouping</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Option value={staticOptions.none}>
            {staticOptions.none.label}
          </Combobox.Option>
          <Combobox.Group label="Standard Groupings">
            <Combobox.Option value={staticOptions.class}>
              {staticOptions.class.label}
            </Combobox.Option>
            <Combobox.Option value={staticOptions.level}>
              {staticOptions.level.label}
            </Combobox.Option>
            <Combobox.Option value={staticOptions.warden}>
              {staticOptions.warden.label}
            </Combobox.Option>
          </Combobox.Group>
          {!!activeGroupOptions.length && (
            <Combobox.Group label="Tag Groupings">
              {activeGroupOptions.map((group) => (
                <Combobox.Option value={group} key={group.value}>
                  {group.label}
                </Combobox.Option>
              ))}
            </Combobox.Group>
          )}
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
};
