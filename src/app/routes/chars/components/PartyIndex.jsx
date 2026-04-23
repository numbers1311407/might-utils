import { useMemo, useState } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
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
    <Stack align="center" m="xl">
      <Text size="xl" c="warning">
        You have no saved parties!
      </Text>
      <Button onClick={() => editParty({})} size="md" w={200}>
        Create one now?
      </Button>
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
      <Text span>{parties.length} Saved Parties</Text>
    </Text>
    <Group justify="right" flex="1">
      <PartySortSelect sort={sort} setSort={setSort} />
    </Group>
  </Group>
);

export const PartyIndex = () => {
  const roster = useRoster({ activeOnly: true });
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
      <Stack>
        <PartyIndexHeader parties={parties} sort={sort} setSort={setSort} />
        {!parties.length && <EmptyResult />}
        {sortedParties.map((party) => (
          <PartyCard
            title={party.name}
            key={party.id}
            party={party.chars}
            comp={comps.get(party.comp)}
            stats={stats.get(party.comp)}
            buttons={
              <Group
                justify="flex-start"
                style={{ flexDirection: "row-reverse" }}
              >
                <ReadinessBadge size="lg" tier={party.diff.tier} />
                <EditSmallButton
                  component={AppLink}
                  href={`/parties/${party.id}`}
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
