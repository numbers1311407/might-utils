import { forwardRef, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { Box, Group, Stack, Paper } from "@mantine/core";
import { useFindPartiesResults } from "../hooks";
import { IconDeviceFloppy as IconDisk } from "@tabler/icons-react";
import { PartyLine } from "@/core/components";

const components = {
  List: forwardRef((props, ref) => <Stack gap="lg" ref={ref} {...props} />),
};

const ItemContent = ({ party, stats }) => (
  <Paper p="sm" flex="1">
    <Group>
      <Box component="pre" flex="1">
        {JSON.stringify(stats.get(party.comp), null, 2)}
      </Box>
      <Box flex="0 0 22rem">
        <Box bg="dark.8" bdrs="sm" p={4} ta="center" pos="relative">
          {party.score}{" "}
          <IconDisk
            size={20}
            style={{ position: "absolute", right: 5, top: 6 }}
          />
        </Box>
        <Box p="sm">
          <PartyLine party={party.party} />
        </Box>
      </Box>
    </Group>
  </Paper>
);

export const PartyResultsList = ({ parties, stats }) => {
  return (
    <Virtuoso
      totalCount={parties.length}
      data={parties}
      components={components}
      useWindowScroll
      itemContent={(_i, party) => <ItemContent party={party} stats={stats} />}
    />
  );
};

export const PartyResults = ({ show = 5000 }) => {
  const { parties, pool, stats } = useFindPartiesResults();

  const hydratedParties = useMemo(() => {
    return parties
      .map((party) => ({
        ...party,
        party: Array.from(party.party).map((idx) => pool[idx]),
      }))
      .slice(0, show);
  }, [parties, pool, show]);

  return <PartyResultsList parties={hydratedParties} stats={stats} />;
};
