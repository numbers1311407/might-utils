import { useMemo, useState, useRef } from "react";
import { Select, Group, Stack, Text } from "@mantine/core";
import { useRoster } from "@/core/store";
import { ClassIcon } from "@/core/components";
import { getClassName } from "@/core/chars";

const renderOption = ({ option: { char } }) => (
  <Group align="flex-end" gap="sm">
    <ClassIcon cls={char.class} size={42} />
    <Stack gap={2}>
      <Text size="md" c="gold" lh={1.2}>
        {char.name}
      </Text>
      <Text size="xs" c="dark">
        Level {char.level} {getClassName(char.class)}
      </Text>
    </Stack>
  </Group>
);

export const CharSelect = ({ exclude = [], onChange, ...props }) => {
  const { roster } = useRoster();
  const [search, setSearch] = useState("");
  const ref = useRef();

  const data = useMemo(() => {
    return roster
      .filter((char) => !exclude.includes(char.id))
      .map((char) => ({ value: char.id, label: char.name, char }));
  }, [roster, exclude]);

  const placeholder = !data.length
    ? "Nobody left to add"
    : "Select party member...";

  return (
    <Select
      size="md"
      placeholder={placeholder}
      {...props}
      data={data}
      styles={{
        option: {
          "&[data-combobox-active]": {
            backgroundColor: "red",
            color: "blue",
          },
          "&[data-combobox-selected]": {
            backgroundColor: "hotpink",
            color: "green",
          },
        },
      }}
      onSearchChange={setSearch}
      disabled={!data.length}
      ref={ref}
      searchValue={search}
      searchable
      selectFirstOptionOnChange
      value=""
      onFocus={() => {
        setSearch("");
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
      renderOption={renderOption}
      onChange={(_value, { char }) => {
        onChange?.(char);
        setSearch("");
        ref.current?.blur();
      }}
    />
  );
};
