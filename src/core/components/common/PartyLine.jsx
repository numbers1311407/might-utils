import { Box, Group, Stack, Text } from "@mantine/core";
import { ClassIcon } from "./ClassIcon.jsx";

export const PartyLine = ({ party }) => {
  return (
    <Stack gap="xs">
      {party.map((slot) => (
        <Group key={slot.idx} wrap="nowrap">
          <Group gap={8}>
            <ClassIcon cls={slot.class} size={20} />
            <Text size="sm">{slot.name}</Text>
          </Group>
          <Text ta="right" flex="1" size="sm">
            {!!slot.warden && ` Rk. ${slot.warden}`} {slot.level}
          </Text>
        </Group>
      ))}
    </Stack>
  );
};
