import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Stack,
  Switch,
  Table,
  Text,
  Title,
  UnstyledButton,
  Paper,
  Popover,
} from "@mantine/core";
import { useState } from "react";
import { charLevelSchema } from "@/core/schemas";
import {
  useConfirmationStore,
  useRosterStore,
  useRosterStoreApi as rosterApi,
  useClassTagsStore,
} from "@/core/store";
import { RosterCharModal } from "./RosterCharModal.jsx";
import { Aside, ClassIcon } from "@/core/components";
import {
  IconEdit,
  IconPlus,
  IconMinus,
  IconTag,
  IconX,
  IconTrash,
} from "@tabler/icons-react";

const TagsPopover = ({ char, classTags }) => (
  <Popover width={220} withArrow shadow="md">
    <Popover.Target>
      <UnstyledButton>
        <IconTag display="block" size={20} />
      </UnstyledButton>
    </Popover.Target>
    <Popover.Dropdown>
      <Stack gap={4}>
        <Flex gap={4}>
          <Text size="sm" fw="bold">
            Class:
          </Text>
          <Text size="sm" c="blue">
            {classTags[char.class]?.length ? (
              classTags[char.class].join(", ")
            ) : (
              <Text c="dimmed" span>
                none
              </Text>
            )}
          </Text>
        </Flex>
        <Flex gap={4}>
          <Text size="sm" fw="bold">
            Own:
          </Text>
          <Text size="sm" c="blue">
            {char.tags?.length ? (
              char.tags.join(", ")
            ) : (
              <Text c="dimmed" span>
                none
              </Text>
            )}
          </Text>
        </Flex>
      </Stack>
    </Popover.Dropdown>
  </Popover>
);

const PlusButton = (props) => (
  <ActionIcon size="sm" {...props}>
    <IconPlus />
  </ActionIcon>
);

const MinusButton = (props) => (
  <ActionIcon size="sm" {...props}>
    <IconMinus />
  </ActionIcon>
);

const EditButton = (props) => (
  <ActionIcon size="sm" {...props}>
    <IconEdit />
  </ActionIcon>
);

const TagButton = (props) => (
  <ActionIcon size="sm" {...props}>
    <IconTag />
  </ActionIcon>
);

const XButton = (props) => (
  <ActionIcon size="sm" {...props}>
    <IconX />
  </ActionIcon>
);

const TrashButton = (props) => (
  <ActionIcon size="sm" {...props}>
    <IconTrash />
  </ActionIcon>
);

const IncrementButtons = ({
  min = 0,
  max,
  value,
  onChange,
  label = "value",
}) => (
  <Paper
    display="inline-flex"
    withBorder
    px={2}
    py={1}
    style={{
      alignItems: "center",
      borderRadius: 4,
      wrap: "nowrap",
      gap: 0,
    }}
  >
    <MinusButton
      aria-label={`Reduce ${label} by 1`}
      disabled={min !== undefined && value <= min}
      onClick={() => onChange?.(value - 1)}
    />
    <Text px={8} flex={1} span align="center">
      {value}
    </Text>
    <PlusButton
      aria-label={`Increase ${label} by 1`}
      disabled={max !== undefined && value >= max}
      onClick={() => onChange?.(value + 1)}
    />
  </Paper>
);

export const RosterEmpty = ({ children }) => (
  <Table.Row>
    <Table.Cell colspan={6}>{children}</Table.Cell>
  </Table.Row>
);

export const RosterChar = ({ char, classTags, edit, update, remove }) => (
  <Table.Tr>
    <Table.Td>
      <Switch
        aria-label="Toggle Active Status"
        color="green"
        checked={char.active}
        onChange={(e) => {
          update({ active: e.currentTarget.checked });
        }}
      />
    </Table.Td>
    <Table.Td>
      <Text style={{ opacity: char.active ? 1 : 0.5 }}>{char.name}</Text>
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
    <Table.Td></Table.Td>
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
      <TagsPopover char={char} classTags={classTags} />
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

export const RosterGrid = ({ roster, onEdit }) => {
  const classTags = useClassTagsStore((store) => store.tags);
  const { getConfirmation } = useConfirmationStore();

  const onRemove = getConfirmation(
    (char) => {
      rosterApi.removeChar(char);
    },
    {
      title: "Are you sure you want to remove this character?",
    },
  );

  return (
    <Table highlightOnHover stickyHeader stickyHeaderOffset={50}>
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
        {!roster.length && (
          <RosterEmpty>
            You have no characters on your roster. Would you like to{" "}
            <Anchor onClick={() => onEdit({})}>create a new character?</Anchor>
          </RosterEmpty>
        )}
        {roster.map((char) => (
          <RosterChar
            key={char.id}
            char={char}
            classTags={classTags}
            edit={onEdit}
            remove={onRemove}
            update={(update) => {
              rosterApi.updateChar(char.id, update);
            }}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
};

export const Roster = () => {
  const roster = useRosterStore((store) => store.roster);
  const { getConfirmation } = useConfirmationStore();
  const [char, setChar] = useState(null);

  const onResetRoster = getConfirmation(
    () => {
      rosterApi.resetRoster();
    },
    {
      message:
        "This will reset the roster back to the initial example roster, " +
        "removing any characters you may have added.",
    },
  );

  const onClearRoster = getConfirmation(
    () => {
      rosterApi.clearRoster();
    },
    {
      message: "This will clear all characters from the roster!",
    },
  );

  return (
    <Box>
      <Group gap={4}>
        <Title order={2} mb="xs" flex={1}>
          Character Roster
        </Title>
        <Button size="xs" onClick={() => setChar({})}>
          New Character
        </Button>
        <Button variant="light" size="xs" onClick={onResetRoster}>
          Reset
        </Button>
        <Button
          variant="light"
          size="xs"
          disabled={!roster?.length}
          onClick={onClearRoster}
        >
          Clear
        </Button>
      </Group>

      <RosterGrid roster={roster} onEdit={(char) => setChar(char)} />

      <RosterCharModal
        roster={roster}
        char={char}
        onSubmit={(char) => {
          rosterApi.addChar(char, () => setChar(null));
        }}
        onClose={() => setChar(null)}
      />
    </Box>
  );
};
