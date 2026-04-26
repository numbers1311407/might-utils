import { useMemo, useState } from "react";
import { Button, Divider, Group, Stack, Text } from "@mantine/core";
import {
  AppLink,
  EditSmallButton,
  RemoveSmallButton,
  SortSelect,
} from "@/core/components";
import {
  usePartiesList,
  getPartyDiff,
  useRoster,
  useSorter,
} from "@/core/hooks";
import {
  usePartiesData,
  usePartyEditor,
  PartyCard,
  ReadinessBadge,
} from "@/core/chars";
import { usePartiesStoreApi as partiesStore } from "@/model/store";

const SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Readiness", value: "diffScore name" },
  { label: "Total Might - High", value: "-score name" },
  { label: "Total Might - Low", value: "score name" },
  {
    label: "Might Variance - Low",
    value: "mightSD mightRange -mightAvg",
  },
  {
    label: "Might Variance - High",
    value: "-mightSD -mightRange mightAvg",
  },
  {
    label: "Might Density - High",
    value: "-mightAvg -mightTotal size",
  },
  {
    label: "Might Density - Low",
    value: "mightAvg mightTotal -size",
  },
];

const PartySortSelect = ({ sort, setSort }) => {
  return <SortSelect sort={sort} setSort={setSort} data={SORT_OPTIONS} />;
};

const EmptyResult = () => {
  const editParty = usePartyEditor();

  return (
    <Stack gap="sm" align="center" my="3xl" mx="auto" w={400}>
      <Text size="xl" c="warning">
        You have no saved parties!
      </Text>
      <Button size="compact-sm" onClick={() => editParty({})} w={150}>
        Create one now?
      </Button>
      <Text size="lg" c="warning">
        OR
      </Text>
      <Text ta="center">
        Use the <AppLink href="/party-generator">party generator</AppLink> to
        find a party for a specific might score and save a result.
      </Text>
    </Stack>
  );
};

const PartyIndexHeader = ({ parties, sort, setSort, ...props }) => (
  <Group
    bg="var(--mantine-color-body-custom)"
    py="xl"
    px={2}
    mt="-lg"
    style={{
      position: "sticky",
      top: 66,
      zIndex: 200,
    }}
  >
    <Text {...props}>
      <Text span>
        {parties.length} Saved {parties.length == 1 ? "Party" : "Parties"}
      </Text>
    </Text>
    <Group justify="right" flex="1">
      <PartySortSelect sort={sort} setSort={setSort} />
    </Group>
  </Group>
);

export const PartyIndex = () => {
  const roster = useRoster({ activeOnly: false });
  const parties = usePartiesList({ hydrate: true, classTags: true });
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const { comps, stats } = usePartiesData(parties);
  const diffedParties = useMemo(() => {
    return parties.map((party) => ({
      ...party,
      diff: getPartyDiff(party, roster),
    }));
  }, [parties, roster]);

  const sortParty = useSorter(sort);

  const sortedParties = useMemo(() => {
    return sortParty(diffedParties, (party) => ({
      name: party.name,
      diffScore: party.diff?.score ?? 0,
      ...(stats.get(party.comp) || {}),
    }));
  }, [diffedParties, sortParty, stats]);

  return (
    <>
      {parties.length > 0 && (
        <PartyIndexHeader parties={parties} sort={sort} setSort={setSort} />
      )}
      <Stack>
        {!parties.length && <EmptyResult />}
        {sortedParties.map((party) => (
          <PartyCard
            title={
              <AppLink
                c="primary"
                size="3xl"
                href={`/parties/${party.id}`}
                underline="hover"
              >
                {party.name}
              </AppLink>
            }
            key={party.id}
            party={party.chars}
            comp={comps.get(party.comp)}
            compType="party"
            stats={stats.get(party.comp)}
            buttons={
              <Group
                justify="flex-start"
                gap="sm"
                style={{ flexDirection: "row-reverse" }}
              >
                <ReadinessBadge size="lg" tier={party.diff.tier} />
                <Divider orientation="vertical" />
                <EditSmallButton
                  component={AppLink}
                  // TODO this is necessary because AppLink otherwise
                  // recolors the button like a link ignoring the variant.
                  // There's probably a better way.
                  bg="var(--mantine-primary-color-filled)"
                  c="var(--mantine-primary-color-contrast)"
                  href={`/parties/${party.id}`}
                  iconOnly={false}
                  underline="never"
                >
                  View & Edit
                </EditSmallButton>
                <RemoveSmallButton
                  onClick={() => partiesStore.remove(party.id)}
                >
                  Remove
                </RemoveSmallButton>
              </Group>
            }
          />
        ))}
      </Stack>
    </>
  );
};
