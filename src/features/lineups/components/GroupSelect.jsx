import { useMemo } from "react";
import { Combobox, useCombobox, Input, InputBase } from "@mantine/core";
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
};

export const GroupSelect = () => {
  const value = useLineupsStore(
    (store) => store.options?.groupBy || staticOptions.none.value,
  );
  const setOption = useLineupsStore((store) => store.setOption);
  const groups = useTagGroupsStore((store) => store.groups);
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
          : `Standard Group: ${option.label}`;
      }
    }
    for (const option of activeGroupOptions) {
      if (value === option.value) {
        return `Tag Group: ${option.label}`;
      }
    }
    return staticOptions.none.label;
  }, [value, activeGroupOptions]);

  return (
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
          {valueLabel || <Input.Placeholder>Choose grouping</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Option value={staticOptions.none}>
          {staticOptions.none.label}
        </Combobox.Option>
        <Combobox.Group label="Standard Groups">
          <Combobox.Option value={staticOptions.class}>
            {staticOptions.class.label}
          </Combobox.Option>
          <Combobox.Option value={staticOptions.level}>
            {staticOptions.level.label}
          </Combobox.Option>
        </Combobox.Group>
        {!!activeGroupOptions.length && (
          <Combobox.Group label="Tag Groups">
            {activeGroupOptions.map((group) => (
              <Combobox.Option value={group} key={group.value}>
                {group.label}
              </Combobox.Option>
            ))}
          </Combobox.Group>
        )}
      </Combobox.Dropdown>
    </Combobox>
  );
};
