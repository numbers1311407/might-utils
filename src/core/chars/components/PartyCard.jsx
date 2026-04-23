import { Box, Group, Grid, Stack, Paper, Text } from "@mantine/core";
import { PartyStack } from "./PartyStack.jsx";
import { PartyStatsTable } from "./PartyStatsTable.jsx";
import { CompBreakdown } from "./CompBreakdown.jsx";

export const PartyCard = ({ party, comp, stats, buttons }) => (
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
      {buttons}
    </Group>
    <Grid gap="xl" pl="md">
      <Grid.Col pr={{ base: 0, md: "lg" }} span={{ base: 12, md: 4 }}>
        <Stack gap="xs">
          <Text size="lg" c="primary.5">
            Party Stats
          </Text>
          <PartyStatsTable stats={stats} />
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
          <PartyStack party={party} />
        </Stack>
      </Grid.Col>
    </Grid>
  </Paper>
);
