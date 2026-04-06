import { Box, Group, Switch, Table, Text, Tooltip } from "@mantine/core";
import { getCharMight } from "@/core/chars";
import { charLevelSchema } from "@/core/schemas";
import {
  ClassIcon,
  EditButton,
  IncrementButtons,
  TrashButton,
  RestoreButton,
} from "@/core/components/common";
import { useClassTagsStore } from "@/core/store";
import { CharTagsPopover } from "./CharTagsPopover.jsx";

export const CharsTableEmptyRow = ({ children }) => (
  <Table.Tr>
    <Table.Td colSpan={8} p="3xl">
      <Box ta="center">{children}</Box>
    </Table.Td>
  </Table.Tr>
);

export const CharsTableRow = ({
  char,
  classTags,
  dirtyChars,
  edit,
  isRoster,
  remove,
  reset,
  update,
}) => (
  <Table.Tr>
    <Table.Td>
      <Switch
        aria-label="Toggle Active Status"
        checked={char.active}
        onChange={(e) => {
          update({ active: e.currentTarget.checked });
        }}
      />
    </Table.Td>
    <Table.Td>
      <Text size="lg" style={{ opacity: char.active ? 1 : 0.5 }}>
        {char.name}
      </Text>
    </Table.Td>
    <Table.Td>
      <Group gap={8} wrap="nowrap">
        <ClassIcon
          size={24}
          cls={char.class}
          style={{ opacity: char.active ? 1 : 0.25 }}
        />
        <Text style={{ opacity: char.active ? 1 : 0.5 }}>{char.class}</Text>
      </Group>
    </Table.Td>
    <Table.Td ta="center">
      {isRoster && char.warden > 0 && (
        <>
          <Text c="yellow.7" span title="Unwardened" ff="mono">
            {getCharMight(char, 0)}
          </Text>{" "}
          -{" "}
        </>
      )}
      <Text c="gold" span title={`Warden ${char.warden}`} ff="mono">
        {getCharMight(char)}
      </Text>
    </Table.Td>
    <Table.Td>
      <IncrementButtons
        value={char.level}
        label="char level"
        min={charLevelSchema.minValue}
        max={charLevelSchema.maxValue}
        onChange={(level) => update({ level })}
      />
    </Table.Td>
    <Table.Td>
      <IncrementButtons
        value={char.warden}
        label="char level"
        min={0}
        max={3}
        onChange={(warden) => update({ warden })}
      />
    </Table.Td>
    <Table.Td align="center">
      <CharTagsPopover tags={char.tags} classTags={classTags[char.class]} />
    </Table.Td>
    <Table.Td>
      <Group gap={6} justify="flex-end">
        {!isRoster && dirtyChars && (
          <Tooltip openDelay={500} label="Reset character to roster version">
            <RestoreButton
              aria-label="Reset character to roster version"
              onClick={() => reset(char)}
              disabled={!dirtyChars.has(char.id)}
            />
          </Tooltip>
        )}
        <Tooltip openDelay={500} label="Edit character">
          <EditButton aria-label="Edit character" onClick={() => edit(char)} />
        </Tooltip>
        <Tooltip openDelay={500} label="Remove character">
          <TrashButton
            aria-label="Remove character"
            onClick={() => remove(char)}
          />
        </Tooltip>
      </Group>
    </Table.Td>
  </Table.Tr>
);

export const CharsTable = ({
  chars,
  dirtyChars,
  onEdit,
  onUpdate,
  onRemove,
  onReset,
  isRoster,
  emptyContent = null,
  Row = CharsTableRow,
  EmptyRow = CharsTableEmptyRow,
  ...props
}) => {
  const classTags = useClassTagsStore((store) => store.tags);

  return (
    <Table stickyHeader stickyHeaderOffset={66} {...props}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th width={65}>Active</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th w={70}>Class</Table.Th>
          <Table.Th ta="center" w={120}>
            Might
          </Table.Th>
          <Table.Th ta="center" width={72}>
            Level
          </Table.Th>
          <Table.Th ta="center" width={72}>
            Warden
          </Table.Th>
          <Table.Th width={50}>Tags</Table.Th>
          <Table.Th width={isRoster ? 70 : 120} ta="right">
            Actions
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!chars.length && (
          <EmptyRow>{emptyContent || "No characters found"}</EmptyRow>
        )}
        {chars.map((char) => (
          <Row
            key={char.id}
            char={char}
            classTags={classTags}
            dirtyChars={dirtyChars}
            edit={onEdit}
            remove={onRemove}
            reset={onReset}
            isRoster={isRoster}
            update={(update) => onUpdate(char.id, update)}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
};

CharsTable.EmptyRow = CharsTableEmptyRow;
CharsTable.Row = CharsTableRow;
