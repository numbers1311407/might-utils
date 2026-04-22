import { forwardRef, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { Badge, Group, Grid, Stack, Paper, Table, Text } from "@mantine/core";
import { useFindPartiesResults } from "../hooks";
import { PartyLine, SaveSmallButton } from "@/core/components";

const StatsTable = ({ stats, ...props }) => {
  const rows = useMemo(() => {
    return [
      ["Might Average", stats.mightAvg],
      [
        "Might Range",
        `${stats.mightRangeBounds[0]}-${stats.mightRangeBounds[1]}`,
      ],
      ["Might Std Dev", stats.mightSD],
      ["Level Average", stats.levelAvg],
      ["Total Warden Ranks", stats.wardenRankTotal],
      [
        "Score from Levels",
        `${stats.levelMightTotal} (${stats.levelMightPct}%)`,
      ],
      [
        "Score from Warden Mult",
        `${stats.wardenMightTotal} (${stats.wardenMightPct}%)`,
      ],
    ].map(([label, value]) => (
      <Table.Tr key={label}>
        <Table.Th py={4} pl={0} pr={8} fw="400">
          {label}
        </Table.Th>
        <Table.Td ta="right" ff="mono" py={4} pr={0} pl={8}>
          {value}
        </Table.Td>
      </Table.Tr>
    ));
  }, [stats]);

  return (
    <Table
      orientation="vertical"
      withRowBorders
      withColumnBorders
      size="sm"
      {...props}
    >
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

const ItemContent = ({ party, comp, stats }) => (
  <Paper p="md" flex="1">
    <Group p="md" align="baseline">
      <Text size="3xl" c="primary" fw="bold">
        {stats.score}{" "}
        <Text span fw="normal">
          Might
        </Text>
      </Text>
      <Text flex="1" size="lg">
        Party Size:{" "}
        <Text span fw="bold" size="xl">
          {stats.size}
        </Text>
      </Text>
      <SaveSmallButton>Save Party</SaveSmallButton>
    </Group>
    <Grid gap="xl" pl="md">
      <Grid.Col pr={{ base: 0, md: "lg" }} span={{ base: 12, md: 4 }}>
        <Stack gap="xs">
          <Text size="lg" c="primary.5">
            Party Stats
          </Text>
          <StatsTable stats={stats} />
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Stack gap="xs">
          <Text size="lg" c="primary.5">
            Party Composition
          </Text>
          <CompBreakdown comp={comp} />
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Stack gap="xs">
          <Text size="lg" c="primary.5">
            Party Lineup
          </Text>
          <PartyLine party={party.party} />
        </Stack>
      </Grid.Col>
    </Grid>
  </Paper>
);

const virtuosoComponents = {
  List: forwardRef((props, ref) => <Stack gap="lg" ref={ref} {...props} />),
};

const CompWarden = ({ rank, ...props }) => {
  if (!rank) return null;
  return <Text {...props}>Rk. {rank}</Text>;
};

export const CompBreakdown = ({ comp, ...props }) => {
  const key = (slot) => `${slot.level}/${slot.warden}/${slot.terms.join(",")}`;

  return (
    <Stack gap="sm" {...props}>
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
    </Stack>
  );
};

export const PartyResultsList = ({ parties, comps, stats }) => {
  return (
    <Virtuoso
      totalCount={parties.length}
      data={parties}
      components={virtuosoComponents}
      useWindowScroll
      itemContent={(_i, party) => (
        <ItemContent
          party={party}
          stats={stats.get(party.comp)}
          comp={comps.get(party.comp)}
        />
      )}
    />
  );
};

export const PartyResults = () => {
  const { parties, pool, comps, stats } = useFindPartiesResults();

  const hydratedParties = useMemo(() => {
    return parties.map((party) => ({
      ...party,
      party: Array.from(party.party).map((idx) => pool[idx]),
    }));
  }, [parties, pool]);

  return (
    <PartyResultsList parties={hydratedParties} comps={comps} stats={stats} />
  );
};
