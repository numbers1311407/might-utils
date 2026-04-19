import { useMemo, useState } from "react";
import { Box, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { ClassIcon, PartyLine } from "@/core/components";
// import { IconTag } from "@tabler/icons-react";
import { humanizeComp } from "@/model/schemas/comp.js";
import { useFindPartiesResults } from "../hooks";
import { Virtuoso } from "react-virtuoso";

// const slots = (idxs, pool, fn) =>
//   Array.from(idxs).map((idx) => fn(pool[idx], idx));

// const CompItemSlots = ({ pool, slotIdxs }) => {
//   return (
//     <Group p="xs">
//       {slots(slotIdxs, pool, (slot, idx) => (
//         <Group key={idx} gap={8}>
//           <ClassIcon cls={slot.class} size={20} />
//           <Text size="sm">
//             {slot.name} {slot.level}
//             {!!slot.warden && ` Rk. ${slot.warden}`}
//           </Text>
//         </Group>
//       ))}
//     </Group>
//   );
// };

const GroupResult = ({ group, pool }) => {
  const { comp, parties, compSlotMap } = group;
  const size = parties.length;
  const [shownParties] = useState(5);
  const { score } = parties[0];

  const hydratedParties = useMemo(() => {
    return parties
      .map((party) => ({
        ...party,
        party: party.party.map((idx) => pool[idx]),
      }))
      .slice(0, shownParties);
  }, [parties, pool, shownParties]);

  return (
    <Paper p="md">
      <Stack gap="sm">
        <Text size="md">
          Might: {score} - {size} parties sharing composition
        </Text>
        <Text size="md">{humanizeComp(comp)}</Text>
        <SimpleGrid
          spacing="2xl"
          cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        >
          {hydratedParties.map((party, i) => (
            <Box key={i}>
              <Text size="lg" ta="center" bg="secondary" bdrs="sm">
                {i + 1}
              </Text>
              <Box p="sm">
                <PartyLine party={party.party} key={i} />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};

export const GroupResults = () => {
  const { groups, pool } = useFindPartiesResults();

  return (
    <Virtuoso
      totalCount={groups.length}
      data={groups}
      useWindowScroll
      components={{ List: Stack }}
      itemContent={(_i, group) => (
        <GroupResult key={group.compStr} group={group} pool={pool} />
      )}
    />
  );
};
