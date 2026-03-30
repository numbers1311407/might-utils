import { Box, Group, Switch, Table, Text } from "@mantine/core";
import { getCharMight } from "@/core/chars";
import { charLevelSchema } from "@/core/schemas";
import {
  ClassIcon,
  EditButton,
  IncrementButtons,
  TrashButton,
} from "@/core/components/common";
import { useClassTagsStore } from "@/core/store";
import { CharTagsPopover } from "./CharTagsPopover.jsx";

export const CharsTableEmptyRow = ({ children }) => (
  <Table.Tr>
    <Table.Td colspan={8} p="3xl">
      <Box ta="center">{children}</Box>
    </Table.Td>
  </Table.Tr>
);

export const CharsTableRow = ({
  char,
  classTags,
  edit,
  isRoster,
  remove,
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
    <Table.Td>
      {isRoster ? (
        <>
          <Text c="yellow.5" span>
            {getCharMight(char, 0)}
          </Text>{" "}
          -{" "}
          <Text c="yellow.3" span>
            {getCharMight(char)}
          </Text>
        </>
      ) : (
        <Text c="yellow.3" span>
          {getCharMight(char)}
        </Text>
      )}
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
      <Group gap={4} justify="flex-end">
        <EditButton
          aria-label="Edit character"
          title="Edit"
          onClick={() => edit(char)}
        />
        <TrashButton
          aria-label="Remove character"
          onClick={() => remove(char)}
        />
      </Group>
    </Table.Td>
  </Table.Tr>
);

export const CharsTable = ({
  chars,
  onEdit,
  onUpdate,
  onRemove,
  isRoster,
  emptyContent = null,
  Row = CharsTableRow,
  EmptyRow = CharsTableEmptyRow,
}) => {
  const classTags = useClassTagsStore((store) => store.tags);

  return (
    <Table stickyHeader stickyHeaderOffset={50}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th width={65}>Active</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Class</Table.Th>
          <Table.Th>Might</Table.Th>
          <Table.Th width={72}>Level</Table.Th>
          <Table.Th width={72}>Warden</Table.Th>
          <Table.Th width={50}>Tags</Table.Th>
          <Table.Th width={70} ta="right">
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
            edit={onEdit}
            remove={onRemove}
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
