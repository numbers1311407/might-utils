import { forwardRef, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { Group, Stack } from "@mantine/core";
import { PartyCard, usePartyEditor } from "@/core/chars";
import { SaveSmallButton } from "@/core/components";
import { useFindPartiesResults } from "../hooks";

const virtuosoComponents = {
  List: forwardRef((props, ref) => <Stack gap="lg" ref={ref} {...props} />),
};

export const PartyResultsList = ({ parties, comps, stats, createParty }) => {
  return (
    <Virtuoso
      totalCount={parties.length}
      data={parties}
      components={virtuosoComponents}
      useWindowScroll
      itemContent={(_i, party) => (
        <PartyCard
          party={party.party}
          createParty={() => createParty(party)}
          stats={stats.get(party.comp)}
          comp={comps.get(party.comp)}
          buttons={
            <Group justify="flex-end">
              <SaveSmallButton
                iconOnly={false}
                onClick={() => createParty(party)}
              >
                Save as Party
              </SaveSmallButton>
            </Group>
          }
        />
      )}
    />
  );
};

export const PartyResults = () => {
  const { parties, pool, comps, stats } = useFindPartiesResults();
  const createParty = usePartyEditor({
    title: "Save this party?",
    confirmNav: true,
    prepareDraft: (party) => ({
      name: `${party.score} Might / ${party.party.length} Members`,
      chars: party.party,
    }),
  });

  const hydratedParties = useMemo(() => {
    return parties.map((party) => ({
      ...party,
      party: Array.from(party.party).map((idx) => pool[idx]),
    }));
  }, [parties, pool]);

  return (
    <PartyResultsList
      parties={hydratedParties}
      comps={comps}
      stats={stats}
      createParty={createParty}
    />
  );
};
