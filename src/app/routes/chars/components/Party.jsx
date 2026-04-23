import {
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useParty, useStableCallback } from "@/core/hooks";
import { AppLink, Aside, CharSelect } from "@/core/components";
import {
  CharsTable,
  PartyDiff,
  PartyDiffProvider,
  PartyDiffToggle,
  usePartyEditor,
  usePartiesData,
  PartyStatsTable,
  CompBreakdown,
} from "@/core/chars";
import { useCalculatorContext } from "@/core/calculators";
import { CharStatsTable as StatsTable } from "./CharStatsTable.jsx";
import { PartiesNav } from "./PartiesNav.jsx";
import { PartyHeader } from "./PartyHeader.jsx";
import { ToggleNpcSimButton } from "./ToggleNpcSimButton.jsx";

export const Party = ({ id: partyId }) => {
  const [_location, setLocation] = useLocation();
  const beginPartyEdit = usePartyEditor();

  const { party, stats: hookStats, ...partyApi } = useParty(partyId);
  const maps = usePartiesData(party ? [party] : []);
  const partyNames = party.chars.map((char) => char.name);

  const { setMight } = useCalculatorContext();
  const might = hookStats?.might.total || 0;
  useEffect(() => {
    setMight(might);
  }, [might, setMight]);

  const copyParty = useStableCallback(() => {
    partyApi.copyParty((copy) => setLocation(`/parties/${copy.id}`));
  });

  const removeParty = useStableCallback(() => {
    partyApi.removeParty(() => setLocation(`/parties`));
  });

  // if we're on a party route and it's not the correct party, or it's the first party,
  // redirect to the /parties route which will load the first party
  if (!party) {
    return <Redirect to="/parties" />;
  }

  return (
    <Box>
      <PartyDiffProvider partyId={partyId}>
        <PartyHeader
          partyId={party.id}
          onCopy={copyParty}
          onRemove={removeParty}
          onRename={() => beginPartyEdit(party)}
          onReset={party.isDirty ? partyApi.resetChars : undefined}
        />

        <Divider my="md" />

        <Grid align="flex-start" gutter="xl">
          <Grid.Col span={{ base: 12, lg: 6 }} order={2}>
            <Paper p="md">
              <Stack gap="xs">
                <Title order={3} c="primary" fw="bold">
                  {party.might} Might
                </Title>
                <Divider />
                <Title order={4} c="primary">
                  Comp Breakdown
                </Title>
                <CompBreakdown
                  score={party.might}
                  comp={maps.comps.get(party.comp)}
                />
                <Title order={4} c="primary">
                  Stats
                </Title>
                <PartyStatsTable stats={maps.stats.get(party.comp)} />
                <Box mt="-xs">
                  <StatsTable
                    mode="stacked"
                    stats={hookStats}
                    rowFilter="Tags"
                    titleColor="primary"
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }} order={1}>
            <Stack gap="md">
              <Paper shadow="md" p="md">
                <Group align="center" mb="xs" gap={4}>
                  <Title order={4} c="primary">
                    Party Members
                  </Title>
                  <Text size="lg" flex="1" ff="mono">
                    ({party.chars.length})
                  </Text>
                  <PartyDiffToggle />
                </Group>
                <CharSelect
                  emits="char"
                  size="md"
                  mb="md"
                  exclude={partyNames}
                  placeholder="Click to add a character..."
                  onChange={(char) => partyApi.addChar(char.name)}
                />
                <CharsTable
                  chars={party.chars}
                  onUpdate={partyApi.updateChar}
                  onRemove={partyApi.removeChar}
                  onReset={partyApi.resetChar}
                  dirtyChars={party.dirty}
                  emptyContent={
                    <Stack gap="sm">
                      <Text c="warning" size="xl">
                        This party has no characters!
                      </Text>
                      <Text>
                        Use the dropdown above to add characters from the
                        roster.
                      </Text>
                      <Text size="lg" c="warning">
                        OR
                      </Text>
                      <Text>
                        Use the{" "}
                        <AppLink href="/party-generator">
                          party generator
                        </AppLink>{" "}
                        to find a party for a specific might score and save a
                        result.
                      </Text>
                    </Stack>
                  }
                />
                <Divider />
                <ToggleNpcSimButton mt="sm" />
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        <Aside>
          <Stack gap="xs">
            <PartyDiff />
            <PartiesNav />
          </Stack>
        </Aside>
      </PartyDiffProvider>
    </Box>
  );
};
