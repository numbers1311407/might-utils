import { Box, Divider, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import {
  AppLink,
  Aside,
  CharsTable,
  useCalculatorContext,
  CharStatsTable as StatsTable,
} from "@/core/components";

import { useParty, useStableCallback } from "@/core/hooks";
import { usePartyEditor } from "./use-party-editor.js";
import { PartiesNav } from "./PartiesNav.jsx";
import { PartyHeader } from "./PartyHeader.jsx";
import { ToggleNpcSimButton } from "./ToggleNpcSimButton.jsx";

export const Party = ({ id: partyId }) => {
  const [_location, setLocation] = useLocation();
  const beginPartyEdit = usePartyEditor();

  const { party, stats, ...partyApi } = useParty(partyId);

  const { setMight } = useCalculatorContext();
  const might = stats?.might.total || 0;
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
      <PartyHeader
        partyId={party.id}
        onCopy={copyParty}
        onRemove={removeParty}
        onRename={() => beginPartyEdit(party)}
        onReset={party.isDirty ? partyApi.resetChars : undefined}
      />

      <Divider my="md" />

      <Grid align="flex-start" gutter="xl">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Stack gap="md">
            <Paper p="md" shadow="md">
              <Title order={4} c="primary">
                Diff
              </Title>
            </Paper>
            <Paper p="md" shadow="md">
              <Title order={4} c="primary">
                Party Stats
              </Title>
              <StatsTable stats={stats} />
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md">
            <Title order={5} mb="xs">
              The Party
            </Title>
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
                    Use the dropdown above to add characters from the roster.
                  </Text>
                  <Text size="lg" c="warning">
                    OR
                  </Text>
                  <Text>
                    Use the{" "}
                    <AppLink href="/party-generator">party generator</AppLink>{" "}
                    to find a party for a specific might score and save a
                    result.
                  </Text>
                </Stack>
              }
            />
            <Divider />
            <ToggleNpcSimButton mt="sm" />
          </Paper>
        </Grid.Col>
      </Grid>

      <Aside>
        <Stack gap="xs">
          <PartiesNav />
        </Stack>
      </Aside>
    </Box>
  );
};
