import { useMemo, useState, useRef } from "react";
import { Select, Group, Stack, Text } from "@mantine/core";
import { useRoster } from "@/core/hooks";
import { ClassIcon } from "@/core/components";
import { getClassName } from "@/config/chars";

// TODO handle checked state better for selected characters in stateful
// mode. (initially this was a stateless button, which is fine, but in
// stateful mode there's no indication on the option of it being selected)
const renderOption = ({ option: { char }, checked }) => {
  return (
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
};

export const CharSelect = ({
  emits = "id",
  exclude = [],
  onChange,
  ...props
}) => {
  const roster = useRoster({ activeOnly: false });
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
      value=""
      {...props}
      data={data}
      onSearchChange={setSearch}
      disabled={props.disabled || !data.length}
      ref={ref}
      searchValue={search}
      searchable
      selectFirstOptionOnChange={props.value === undefined}
      onFocus={() => {
        setSearch("");
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
      renderOption={renderOption}
      onChange={(id, option) => {
        const { char = null } = option || {};
        onChange?.(emits === "char" ? char : id);
        setSearch("");
        ref.current?.blur();
      }}
    />
  );
};
