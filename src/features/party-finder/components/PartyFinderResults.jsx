import { useMemo } from "react";
import { List, Stack, Table, Text } from "@mantine/core";
import { useFindPartiesResults } from "../hooks";
import { processComp } from "@/model/schemas/comp";

const GroupedParties = ({ groups }) => {
  return (
    <Stack>
      {groups.map(([compStr, parties]) => {
        const comp = processComp(compStr);

        return (
          <div key={compStr}>
            <List>
              {comp.map((req, i) => (
                <List.Item key={i}>
                  {req.count} {req.level} rank {req.warden}
                  {!!req.terms.length && " - " + req.terms.join(",")}
                </List.Item>
              ))}
            </List>
            <PartiesTable parties={parties} />
          </div>
        );
      })}
    </Stack>
  );
};

const PartiesTable = ({ parties }) => {
  const { pool } = useFindPartiesResults();

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Score</Table.Th>
          <Table.Th>Size</Table.Th>
          <Table.Th>Party</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {parties.map((party, index) => (
          <Table.Tr key={index}>
            <Table.Td>{party.score}</Table.Td>
            <Table.Td>{party.party.length}</Table.Td>
            <Table.Td>
              {Array.from(party.party)
                .map(
                  (i) =>
                    `${pool[i].name}@${pool[i].level}${pool[i].warden ? `w${pool[i].warden}` : ""}`,
                )
                .join(", ")}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const useGroupedParties = () => {
  const { groupBy, parties } = useFindPartiesResults();

  return useMemo(() => {
    return (
      groupBy &&
      Object.entries(
        parties.reduce((acc, party) => {
          acc[party.comp] ||= [];
          acc[party.comp].push(party);
          return acc;
        }, {}),
      )
    );
  }, [parties, groupBy]);
};

export const PartyFinderResults = () => {
  const { size, parties } = useFindPartiesResults();
  const groups = useGroupedParties();

  return (
    <Stack gap={0}>
      <Text py="sm" px="xs">
        {size} Results
        {groups && ` in ${groups.length} level/rank configurations`}
      </Text>
      {groups ? (
        <GroupedParties groups={groups} />
      ) : (
        <PartiesTable parties={parties} />
      )}
    </Stack>
  );
};
