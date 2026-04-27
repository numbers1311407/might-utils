import { AppLink } from "@/core/components";
import { Divider, Badge, Group, Stack, Text, Tooltip } from "@mantine/core";

const CompWarden = ({ rank, ...props }) => {
  if (!rank) return null;
  return <Text {...props}>Rk. {rank}</Text>;
};

export const CompBreakdown = ({ comp, type, score, ...props }) => {
  const key = (slot) => `${slot.level}/${slot.warden}/${slot.terms.join(",")}`;

  return (
    <Stack gap={0} {...props}>
      <Stack gap={6} py={4}>
        {comp.map((slot) => (
          <Group key={key(slot)} gap={4} align="baseline">
            <Text span size="2xl" ff="mono" c="primary">
              {slot.count}
            </Text>
            <Text span c="primary-accent">
              x
            </Text>
            <Text span size="2xl" ff="mono">
              {slot.level}
            </Text>
            <CompWarden size="md" ff="mono" rank={slot.warden} />
            {slot.terms.length && (
              <Group pb={3} style={{ alignSelf: "stretch" }} pl={4} gap={5}>
                {slot.terms.reduce((items, term, _i, terms) => {
                  items.push(
                    <Badge size="sm" key={term}>
                      {term}
                    </Badge>,
                  );
                  if (type !== "party" && term !== terms[terms.length - 1]) {
                    items.push(
                      <Text span key={term + "+"}>
                        +
                      </Text>,
                    );
                  }
                  return items;
                }, [])}
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
              Total Might:{" "}
              <Tooltip
                w={210}
                multiline
                label={`Search for parties with ${score} might in the party generator`}
              >
                <AppLink href={`/party-generator?targetScore=${score}`}>
                  {score}
                </AppLink>
              </Tooltip>
            </Text>
          </Group>
        </>
      )}
    </Stack>
  );
};
