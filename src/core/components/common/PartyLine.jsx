import { Box, Group, Stack, Text } from "@mantine/core";
import { ClassIcon } from "./ClassIcon.jsx";

export const PartyLine = ({
  party,
  bg = "dark.9",
  border = "var(--mantine-color-default-border)",
  ...props
}) => {
  return (
    <Box bg={bg} bdrs="md" p="sm" gap={1} bd={`1px solid ${border}`} {...props}>
      <Stack gap={1} bg={border}>
        {party.map((slot) => (
          <Group key={slot.idx} wrap="nowrap" bg={bg} pt={4} pb={4} px={6}>
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
    </Box>
  );
};
