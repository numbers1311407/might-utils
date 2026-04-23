import { Box, Group, Grid, Stack, Paper, Text } from "@mantine/core";
import { PartyStack } from "./PartyStack.jsx";
import { PartyStatsTable } from "./PartyStatsTable.jsx";
import { CompBreakdown } from "./CompBreakdown.jsx";

export const PartyCard = ({ title, party, comp, stats, buttons }) => (
  <Paper p="xl" flex="1">
    <Stack gap="xs">
      <Group align="flex-start">
        <Stack gap="xs">
          {title && (
            <Text size="2xl" c="primary" fw="bold">
              {title}
            </Text>
          )}
          <Group align="center" gap={10}>
            <Text
              size={title ? "xl" : "2xl"}
              c="primary"
              fw={title ? 400 : "bold"}
            >
              {stats?.score ?? 0}{" "}
              <Text span fw="normal">
                Might
              </Text>
            </Text>
            <Text span>/</Text>
            <Text flex="1" size="lg">
              <Text span fw="bold" size="lg">
                {stats?.size ?? 0}
              </Text>{" "}
              Members
            </Text>
          </Group>
        </Stack>
        <Box flex="1">{buttons}</Box>
      </Group>
      {stats && comp && (
        <Grid gap="xl">
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
              <CompBreakdown comp={comp} score={stats?.score} />
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
      )}
    </Stack>
  </Paper>
);
