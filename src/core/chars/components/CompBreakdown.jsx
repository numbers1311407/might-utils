import { Divider, Badge, Group, Stack, Text } from "@mantine/core";

const CompWarden = ({ rank, ...props }) => {
  if (!rank) return null;
  return <Text {...props}>Rk. {rank}</Text>;
};

export const CompBreakdown = ({ comp, score, ...props }) => {
  const key = (slot) => `${slot.level}/${slot.warden}/${slot.terms.join(",")}`;

  return (
    <Stack gap={0} {...props}>
      <Stack gap={6} py={4}>
        {comp.map((slot) => (
          <Group key={key(slot)} gap={4} align="baseline">
            <Text span size="2xl" ff="mono" my={0} c="primary">
              {slot.count}
            </Text>
            <Text span c="primary.5">
              x
            </Text>
            <Text span size="2xl" ff="mono">
              {slot.level}
            </Text>
            <CompWarden size="md" ff="mono" rank={slot.warden} />
            {slot.terms.length && (
              <Group
                style={{ alignSelf: "stretch" }}
                align="flex-start"
                pt={3}
                pl={4}
                gap={6}
              >
                {slot.terms.map((term) => (
                  <Badge size="sm" key={term}>
                    {term}
                  </Badge>
                ))}
              </Group>
            )}
            <Text ff="mono" ta="right" flex="1">
              {slot.might * slot.count}
            </Text>
          </Group>
        ))}
      </Stack>
      {score !== undefined && (
        <>
          <Divider my={4} />
          <Group justify="right">
            <Text ff="mono" ta="right" flex="1">
              Total Might: {score}
            </Text>
          </Group>
        </>
      )}
    </Stack>
  );
};
