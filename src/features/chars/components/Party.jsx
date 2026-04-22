import {
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useParty, useStableCallback } from "@/core/hooks";
import {
  AppLink,
  Aside,
  CharSelect,
  useCalculatorContext,
} from "@/core/components";
import { CharsTable } from "./CharsTable.jsx";
import { CharStatsTable as StatsTable } from "./CharStatsTable.jsx";
import { usePartyEditor } from "../hooks/use-party-editor.js";
import { PartiesNav } from "./PartiesNav.jsx";
import { PartyHeader } from "./PartyHeader.jsx";
import { ToggleNpcSimButton } from "./ToggleNpcSimButton.jsx";
import { PartyDiff, PartyDiffProvider, PartyDiffToggle } from "./party-diff";

export const Party = ({ id: partyId }) => {
  const [_location, setLocation] = useLocation();
  const beginPartyEdit = usePartyEditor();

  const { party, stats, ...partyApi } = useParty(partyId);

  const partyNames = party.chars.map((char) => char.name);

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
            <Stack gap="md">
              <Paper p="md" shadow="md">
                <Title order={4} c="primary">
                  Party Stats
                </Title>
                <StatsTable stats={stats} />
              </Paper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }} order={1}>
            <Stack gap="md">
              <Paper shadow="md" p="md">
                <Group align="center" mb="xs">
                  <Title order={4} c="primary" flex="1">
                    The Party
                  </Title>
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
              <Paper p="md">Comp Breakdown</Paper>
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
