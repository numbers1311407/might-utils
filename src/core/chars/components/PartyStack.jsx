import { Box, Group, Stack, Text } from "@mantine/core";
import { ClassIcon } from "@/core/components";

const divider = "var(--mantine-color-default-border)";
const bg =
  "light-dark(var(--mantine-color-primary-5), var(--mantine-color-secondary-9))";

export const PartyStack = ({ party, ...props }) => {
  return (
    <Box
      bg={bg}
      bdrs="md"
      p="xs"
      gap={1}
      bd={`1px solid ${divider}`}
      {...props}
    >
      <Stack gap={1} bg={divider} c="white">
        {party.map((slot) => (
          <Group key={slot.name} wrap="nowrap" bg={bg} pt={4} pb={4} px={6}>
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
