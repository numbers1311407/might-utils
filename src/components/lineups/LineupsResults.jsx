import { Table, Text } from "@mantine/core";
import { useFindLineupsResults } from "@/lib/lineups";

export const LineupsResults = () => {
  const data = useFindLineupsResults();

  return (
    <>
      <Text py="sm" px="xs">
        {data.lineups.length} Results
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Score</Table.Th>
            <Table.Th>Size</Table.Th>
            <Table.Th>Lineup</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.lineups.map((lineup, index) => (
            <Table.Tr key={index}>
              <Table.Td>{lineup.score}</Table.Td>
              <Table.Td>{lineup.size}</Table.Td>
              <Table.Td>
                {lineup.lineup
                  .map(
                    (slot) =>
                      `${slot.class}/${slot.level}${slot.warden ? `rk${slot.warden}` : ""}`,
                  )
                  .join(", ")}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};
