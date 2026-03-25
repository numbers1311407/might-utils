import {
  ActionIcon,
  Box,
  Button,
  Card,
  CloseButton,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useRosterStore } from "@/core/store";
import { RosterCharModal } from "./RosterCharModal.jsx";
import { Aside, ClassIcon } from "@/core/components";
import { IconEdit, IconPlus, IconMinus } from "@tabler/icons-react";

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

const LevelButtons = ({ level, onChange }) => (
  <Group gap={0} display="inline-flex">
    <MinusButton
      aria-label="Reduce char level by 1"
      onClick={() => onChange?.(level - 1)}
    />
    <Box flex={1} bg="gray.8" px={8}>
      {level}
    </Box>
    <PlusButton
      aria-label="Increase char level by 1"
      onClick={() => onChange?.(level + 1)}
    />
  </Group>
);

export const RosterChar = ({ char, edit, update, remove }) => {
  return (
    <Card p="sm">
      <Box>
        <ClassIcon size={40} cls={char.class} />
        {char.name}, rank {char.warden}
      </Box>
      <Box>
        <Switch
          aria-label="Toggle Active Status"
          color="green"
          checked={char.active}
          onChange={(e) => {
            update({ active: e.currentTarget.checked });
          }}
        />
        <LevelButtons
          level={char.level}
          onChange={(level) => update({ level })}
        />
        <CloseButton aria-label="Remove Character" onClick={() => remove()} />
        <EditButton aria-label="Edit character" title="Edit" onClick={edit} />
      </Box>
    </Card>
  );
};

export const Roster = () => {
  const [char, setChar] = useState(null);
  const roster = useRosterStore((store) => store.roster);

  const addChar = useRosterStore((store) => store.addChar);
  const clearRoster = useRosterStore((store) => store.clearRoster);
  const removeChar = useRosterStore((store) => store.removeChar);
  const resetRoster = useRosterStore((store) => store.resetRoster);
  const updateChar = useRosterStore((store) => store.updateChar);

  return (
    <Box>
      <Title size="h2" mb="xs">
        Character Roster
      </Title>
      <Stack gap="xs" my="md">
        {roster.map((char) => (
          <RosterChar
            key={char.id}
            char={char}
            roster={roster}
            edit={() => setChar(char)}
            remove={() => removeChar(char)}
            update={(update) => {
              updateChar(char.id, update);
            }}
          />
        ))}
      </Stack>
      <Aside>
        <Text mb="sm">
          Your stable of characters. The characters defined here will be
          considered when finding squads.
        </Text>
        <Text>
          By default, only characters marked as "active" will be eligible,
          though this behavior is toggleable.
        </Text>
        <Divider my="lg" />
        <Button onClick={() => resetRoster()}>Reset Roster</Button>
        <Button onClick={() => clearRoster()}>Clear Roster</Button>
        <Button onClick={() => setChar({})}>New Character</Button>
      </Aside>
      <RosterCharModal
        roster={roster}
        char={char}
        onSubmit={(char) => {
          addChar(char, () => setChar(null));
        }}
        onClose={() => setChar(null)}
      />
    </Box>
  );
};
