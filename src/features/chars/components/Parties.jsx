import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import * as titles from "@/config/constants/titles";
import { useEffect, useMemo, useState } from "react";
import { IconPlus, IconCalculator } from "@tabler/icons-react";
import { useLocation, useRoute, Redirect } from "wouter";
import { usePartiesStoreApi as partiesApi } from "@/model/store";
import {
  AppLink,
  Aside,
  CharSelect,
  CharsTable,
  PageTitle,
  useCalculatorContext,
  useFloatingNpcSimulator,
  EditSmallButton,
  RemoveSmallButton,
  RestoreSmallButton,
  CopySmallButton,
  CharStatsTable as StatsTable,
  SaveSmallButton,
} from "@/core/components";
import { useParty, useStableCallback } from "@/core/hooks";

import { PartiesNav } from "./PartiesNav.jsx";
import { PartyModal } from "./PartyModal.jsx";

const PartyHeader = ({ partyId, onCopy, onRemove, onReset, onRename }) => {
  const { party, ...api } = useParty(partyId);

  const partyNames = useMemo(
    () => party.chars?.map((char) => char.name),
    [party],
  );

  return (
    <>
      <PageTitle
        section={<Text c="var(--mantine-color-white)">Current Party</Text>}
        divider={false}
        title={party.name}
        order={3}
        size="h2"
        mb={8}
        mt={8}
      >
        <CharSelect
          label={<Box>Add a Character</Box>}
          emits="char"
          size="md"
          styles={{
            root: {
              display: "flex",
              alignItems: "center",
              gap: 12,
            },
          }}
          exclude={partyNames}
          onChange={(char) => {
            partiesApi.addChar(party.id, char.name);
          }}
        />
      </PageTitle>
      <Group>
        <Group gap={8} my="sm">
          <EditSmallButton onClick={onRename}>Rename</EditSmallButton>
          <CopySmallButton onClick={onCopy}>Duplicate</CopySmallButton>
          <SaveSmallButton
            disabled={!api.snapshotDirty}
            onClick={() => api.saveSnapshot()}
          >
            Save Snapshot
          </SaveSmallButton>
          <RestoreSmallButton
            disabled={!api.hasSnapshot || !api.snapshotDirty}
            onClick={() => api.restoreSnapshot()}
          >
            Restore Snapshot
          </RestoreSmallButton>
          <RestoreSmallButton disabled={!onReset} onClick={onReset}>
            Roster Sync
          </RestoreSmallButton>
          <RemoveSmallButton onClick={onRemove}>Remove</RemoveSmallButton>
        </Group>
      </Group>
    </>
  );
};

const ToggleNpcSimButton = (props) => {
  const { api } = useFloatingNpcSimulator();
  return (
    <Button
      size="compact-md"
      onClick={api.toggle}
      leftSection={<IconCalculator />}
      variant="subtle"
      {...props}
    >
      Toggle instance NPC sim for this party
    </Button>
  );
};

// TODO most of this data could be moved to a `useParties` hook, which is
// probably a pattern that should be established: components probably shouldn't
// generally access low level stores but instead should use higher level stores
// that bake in view logic
export const Parties = () => {
  const [_match, { id: routeId }] = useRoute("/parties/:id?");
  const { dirtyChars, party, partyId, stats, ...partyApi } = useParty(routeId, {
    defaultToFirst: true,
  });

  const [draftParty, editParty] = useState(null);
  const [_location, setLocation] = useLocation();
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

  const renameParty = useStableCallback(() => {
    editParty(party);
  });

  const saveParty = useStableCallback((record) => {
    editParty(null);
    partiesApi.add(record);
    if (partyId !== record.id) {
      setLocation(`/parties/${record.id}`);
    }
  });

  // if we're on a party route and it's not the correct party, or it's the first party,
  // redirect to the /parties route which will load the first party
  if (routeId && partyId !== routeId) {
    return <Redirect to="/parties" />;
  }

  return (
    <Box>
      <PageTitle
        section={titles.PARTY_CATEGORY}
        title={titles.PARTIES_TITLE}
        subtitle={
          "Assemble parties from your roster to track their might and target specific instance tiers"
        }
      />

      {!party && (
        <Stack align="center" ta="center" p="3xl">
          <Text size="lg" c="primary">
            You have no saved parties.
          </Text>
          <Text size="md" style={{ maxWidth: 580 }} ta="center">
            Click the button in the top right to create one manually, or use the{" "}
            <AppLink href="/">party finder</AppLink> and save resulting parties
            you want to track.
          </Text>
        </Stack>
      )}

      {party && (
        <PartyHeader
          partyId={party.id}
          onCopy={copyParty}
          onRemove={removeParty}
          onRename={renameParty}
          onReset={dirtyChars.size ? partyApi.resetChars : null}
        />
      )}

      <Divider my="md" />

      {party && (
        <Grid align="flex-start" gutter="xl">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper p="md" shadow="md">
              <Title order={5} mb="xs">
                Party Stats
              </Title>
              <StatsTable stats={stats} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper shadow="md" p="md">
              <Title order={5} mb="xs">
                The Party
              </Title>
              <CharsTable
                chars={party ? party.chars : []}
                onUpdate={partyApi.updateChar}
                onRemove={partyApi.removeChar}
                onReset={partyApi.resetChar}
                dirtyChars={dirtyChars}
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
      )}

      <Aside>
        <Stack gap="sm">
          <Button
            fullWidth
            leftSection={<IconPlus size={18} />}
            onClick={() => editParty({})}
          >
            Create a New Party
          </Button>
          <PartiesNav current={party?.id} />
        </Stack>
      </Aside>

      <PartyModal
        onClose={() => editParty(null)}
        onSubmit={saveParty}
        record={draftParty}
      />
    </Box>
  );
};
