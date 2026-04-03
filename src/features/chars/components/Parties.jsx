import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import {
  useConfirmationStore,
  usePartiesStoreApi as partiesApi,
  usePartiesList,
} from "@/core/store";
import {
  AppLink,
  Aside,
  CharModalForm,
  CharSelect,
  CharsTable,
  PageTitle,
} from "@/core/components";
import { useStableCallback } from "@/core/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useLocation, useRoute, Redirect } from "wouter";

import { PartiesNav } from "./PartiesNav.jsx";
import { PartyModal } from "./PartyModal.jsx";

const PartyHeader = ({ party, onRemove, onReset, onRename }) => {
  const exclude = useMemo(() => party.chars?.map((char) => char.id), [party]);

  return (
    <>
      <Text c="dark" size="sm">
        Current Party:
      </Text>
      <PageTitle
        divider={false}
        title={party.name}
        order={3}
        size="h2"
        mb={8}
        mt={8}
      />
      <Group gap={8}>
        <Button size="sm" variant="light" onClick={onRename}>
          Rename
        </Button>
        <Button size="sm" variant="outline" onClick={onRemove}>
          Remove
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!onReset}
          onClick={onReset}
        >
          Reset
        </Button>
        <Box flex="1"></Box>
        <CharSelect
          size="md"
          exclude={exclude}
          onChange={(char) => {
            partiesApi.addChar(party.id, char.id);
          }}
        />
      </Group>
    </>
  );
};

const useDirtyChars = (party) => {
  return useMemo(() => {
    const acc = { dirty: {}, count: 0 };
    return (party?.chars || []).reduce((acc, char) => {
      const dirty = partiesApi.isCharDirty(party.id, char.id);
      acc.dirty[char.id] = dirty;
      acc.count += dirty ? 1 : 0;
      return acc;
    }, acc);
  }, [party]);
};

export const Parties = () => {
  const parties = usePartiesList();
  const { getConfirmation } = useConfirmationStore();
  const [draftParty, editParty] = useState(null);
  const [draftChar, editChar] = useState(null);
  const [_match, { id: routeId }] = useRoute("/parties/:id?");
  const [_location, setLocation] = useLocation();

  const party = useMemo(() => {
    return parties.find((party) => party.id === routeId) || parties[0];
  }, [parties, routeId]);
  const partyId = party?.id;

  const dirtyChars = useDirtyChars(party);

  const removeParty = getConfirmation(
    () => {
      partiesApi.remove(partyId);
      setLocation(`/parties`);
    },
    {
      title: "Are you sure you want to remove this party?",
      message: "This can't be undone.",
    },
  );

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

  const updateChar = useStableCallback((charId, update) => {
    partiesApi.updateChar(partyId, charId, update);
  });

  const resetChar = getConfirmation(
    (char) => partiesApi.resetChar(partyId, char.id),
    {
      message:
        "This will resync this character with their roster version, " +
        "reverting any changes to level, warden, and tags.",
    },
  );

  const resetPartyChars = getConfirmation(
    () => partiesApi.resetChars(partyId),
    {
      message:
        "This will resync all characters with their roster versions, " +
        "reverting any changes to level, warden, and tags.",
    },
  );

  const removeChar = getConfirmation(
    (char) => {
      partiesApi.removeChar(partyId, char);
    },
    {
      title: "Are you sure you want to remove this character from the party?",
      message: "They will still be avaiable to re-add from the roster.",
    },
  );

  // if we're on a party route and it's not the correct party, or it's the first party,
  // redirect to the /parties route which will load the first party
  if (routeId && (!partyId || partyId === parties[0]?.id)) {
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
          <Text size="lg" c="gold">
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
          onRemove={removeParty}
          onRename={renameParty}
          onReset={dirtyChars.count ? resetPartyChars : null}
        />
      )}

      {party && (
        <CharsTable
          my="xl"
          chars={party ? party.chars : []}
          onEdit={editChar}
          onUpdate={updateChar}
          onRemove={removeChar}
          onReset={resetChar}
          dirtyChars={dirtyChars.dirty}
          emptyContent={
            <>
              <Text>This party has no characters!</Text>
              <Text>
                Use the dropdown above to add characters from the roster.
              </Text>
            </>
          }
        />
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
