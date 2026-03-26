import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Group,
  Stack,
  Switch,
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
  <Group gap={0} display="inline-flex" wrap="nowrap">
    <MinusButton
      aria-label={`Reduce ${label} by 1`}
      disabled={min !== undefined && value <= min}
      onClick={() => onChange?.(value - 1)}
    />
    <Paper flex={1} px={8}>
      {value}
    </Paper>
    <PlusButton
      aria-label={`Increase ${label} by 1`}
      disabled={max !== undefined && value >= max}
      onClick={() => onChange?.(value + 1)}
    />
  </Group>
);

export const RosterChar = ({ char, classTags, edit, update, remove }) => {
  return (
    <Card p="sm" withBorder>
      <Flex gap="sm">
        <ClassIcon
          size={80}
          cls={char.class}
          style={{ opacity: char.active ? 1 : 0.25 }}
        />

        <Stack gap={8} flex="1">
          <Flex gap={6} align="center">
            <Text flex={1} size="xl" lh={1}>
              {char.name} - {char.class}
            </Text>
            <Group gap={4}>
              <TagsPopover char={char} classTags={classTags} />
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
          </Flex>

          <Flex gap="lg">
            <Stack gap={0} align="flex-start">
              <Text>Level</Text>
              <IncrementButtons
                value={char.level}
                label="char level"
                min={charLevelSchema.minValue}
                max={charLevelSchema.maxValue}
                onChange={(level) => update({ level })}
              />
            </Stack>
            <Stack gap={0} align="flex-start">
              <Text>Warden</Text>
              <IncrementButtons
                value={char.warden}
                label="char level"
                min={0}
                max={3}
                onChange={(warden) => update({ warden })}
              />
            </Stack>
            <Box flex={1} />
            <Stack gap={0} align="center">
              <Text>Active</Text>
              <Switch
                aria-label="Toggle Active Status"
                color="green"
                checked={char.active}
                onChange={(e) => {
                  update({ active: e.currentTarget.checked });
                }}
              />
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};

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
    <SimpleGrid cols={{ base: 1, lg: 2, xl: 3 }} gap="xs" my="md">
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
    </SimpleGrid>
  );
};

export const Roster = () => {
  const roster = useRosterStore((store) => store.roster);
  const [char, setChar] = useState(null);

  return (
    <Box>
      <Title order={2} mb="xs">
        Character Roster
      </Title>

      <RosterGrid roster={roster} onEdit={(char) => setChar(char)} />

      <Aside>
        <Text mb="sm">
          Your stable of characters. The characters defined here will be
          considered when finding parties.
        </Text>
        <Text>
          By default, only characters marked as "active" will be eligible,
          though this behavior is toggleable.
        </Text>
        <Divider my="lg" />
        <Button onClick={() => rosterApi.resetRoster()}>Reset Roster</Button>
        <Button onClick={() => rosterApi.clearRoster()}>Clear Roster</Button>
        <Button onClick={() => setChar({})}>New Character</Button>
      </Aside>

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
