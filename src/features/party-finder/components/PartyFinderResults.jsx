import { useMemo } from "react";
import { Stack, Table, Text } from "@mantine/core";
import { humanizeGroupTag } from "@/core/tags";
import { useFindPartiesResults } from "../hooks";

const GroupedParties = ({ groups }) => {
  return (
    <Stack>
      {groups.map(([groupTag, parties]) => (
        <div key={groupTag}>
          <Text px="xs">{humanizeGroupTag(groupTag)}</Text>
          <PartiesTable parties={parties} />
        </div>
      ))}
    </Stack>
  );
};

const PartiesTable = ({ parties }) => (
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
          <Table.Td>{party.size}</Table.Td>
          <Table.Td>
            {party.party
              .map(
                (slot) =>
                  `${slot.name}@${slot.level}${slot.warden ? `rk${slot.warden}` : ""}`,
              )
              .join(", ")}
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
);

export const PartyFinderResults = () => {
  const { size, parties, grouped } = useFindPartiesResults();

  const groups = useMemo(() => {
    return (
      grouped &&
      Object.entries(
        parties.reduce((acc, party) => {
          acc[party.group] ||= [];
          acc[party.group].push(party);
          return acc;
        }, {}),
      )
    );
  }, [parties, grouped]);

  return (
    <Stack gap={0}>
      <Text py="sm" px="xs">
        {size} Results
        {grouped && ` in ${groups.length} level/rank configurations`}
      </Text>
      {grouped ? (
        <GroupedParties groups={groups} />
      ) : (
        <PartiesTable parties={parties} />
      )}
    </Stack>
  );
};
