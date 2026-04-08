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
import { useEffect, useMemo, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useLocation, useRoute, Redirect } from "wouter";
import {
  getConfirmation,
  usePartiesStoreApi as partiesApi,
} from "@/core/store";
import {
  AppLink,
  Aside,
  CharModalForm,
  CharSelect,
  CharsTable,
  PageTitle,
  NpcSimulator,
  useCalculatorContext,
  EditSmallButton,
  RemoveSmallButton,
  RestoreSmallButton,
  CopySmallButton,
  TierSelect,
  CalculatorContextProvider,
} from "@/core/components";
import { useParty, useStableCallback } from "@/core/hooks";

import { PartiesNav } from "./PartiesNav.jsx";
import { PartyModal } from "./PartyModal.jsx";
import { StatsTable } from "./StatsTable.jsx";

const PartyHeader = ({ party, onCopy, onRemove, onReset, onRename }) => {
  const exclude = useMemo(() => party.chars?.map((char) => char.id), [party]);

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
          exclude={exclude}
          onChange={(char) => {
            partiesApi.addChar(party.id, char.id);
          }}
        />
      </PageTitle>
      <Group gap={8} my="sm">
        <EditSmallButton onClick={onRename}>Rename</EditSmallButton>
        <CopySmallButton onClick={onCopy}>Duplicate</CopySmallButton>
        <RestoreSmallButton disabled={!onReset} onClick={onReset}>
          Reset
        </RestoreSmallButton>
        <RemoveSmallButton onClick={onRemove}>Remove</RemoveSmallButton>
      </Group>
    </>
  );
};

// TODO most of this data could be moved to a `useParties` hook, which is
// probably a pattern that should be established: components probably shouldn't
// generally access low level stores but instead should use higher level stores
// that bake in view logic
export const PartiesMain = () => {
  const [_match, { id: routeId }] = useRoute("/parties/:id?");
  const [draftParty, editParty] = useState(null);
  const [draftChar, editChar] = useState(null);
  const [_location, setLocation] = useLocation();
  const { setMight } = useCalculatorContext();

  const { dirtyChars, party, partyId, stats, ...partyApi } = useParty(routeId, {
    defaultToFirst: true,
  });

  useEffect(() => {
    setMight(stats?.might?.total || 0);
  }, [stats]);

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

  const saveChar = useStableCallback((char) => {
    editChar(null);
    partiesApi.updateChar(partyId, char.id, char);
  });

  // if we're on a party route and it's not the correct party, or it's the first party,
  // redirect to the /parties route which will load the first party
  if (routeId && partyId !== routeId) {
    return <Redirect to="/parties" />;
  }

  return (
    <Box>
      <PageTitle
        section="Team Management"
        title="Saved Parties"
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
          party={party}
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
            <Stack>
              <Paper p="md" shadow="md">
                <Title order={5} mb="xs">
                  Instance Offerings for Might{" "}
                  <Text span c="primary">
                    {stats.might.total}
                  </Text>
                </Title>
                <Simulator />
              </Paper>
              <Paper p="md" shadow="md">
                <Title order={5} mb="xs">
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
                chars={party ? party.chars : []}
                onEdit={editChar}
                onUpdate={partyApi.updateChar}
                onRemove={partyApi.removeChar}
                onReset={partyApi.resetChar}
                dirtyChars={dirtyChars}
                emptyContent={
                  <Stack>
                    <Text>This party has no characters!</Text>
                    <Text>
                      Use the dropdown above to add characters from the roster.
                    </Text>
                  </Stack>
                }
              />
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

      <CharModalForm
        char={draftChar}
        onClose={() => editChar(null)}
        onSubmit={saveChar}
        isParty
      />

      <PartyModal
        onClose={() => editParty(null)}
        onSubmit={saveParty}
        record={draftParty}
      />
    </Box>
  );
};

const Simulator = () => {
  const { setMight, instance, setInstance, ...ctx } = useCalculatorContext();
  return (
    <Stack>
      <TierSelect value={instance} onChange={setInstance} />
      <NpcSimulator instance={instance} {...ctx} />
    </Stack>
  );
};

export const Parties = () => {
  return (
    <CalculatorContextProvider>
      <PartiesMain />
    </CalculatorContextProvider>
  );
};
