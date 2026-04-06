import { useMemo } from "react";
import { List, Stack, Table, Text } from "@mantine/core";
import { getClassName } from "@/core/chars";
import { useFindPartiesResults } from "../hooks";

const hWarden = (rank) => (rank === "0" ? "Unwardened" : `Rank ${rank}`);

const typeFn = (type) => {
  return {
    warden: (warden, level) => `${hWarden(warden)} ${level}`,
    level: (_level, level, warden) => `${hWarden(warden)} ${level}`,
    class: (cls, level, warden) =>
      `${hWarden(warden)} ${level} ${getClassName(cls)}`,
    tags: (tags, level, warden) =>
      `${hWarden(warden)} ${level} tagged: "${tags.split(",").join('", "')}"`,
  }[type];
};

const humanizeGroupKey = (groupKey) => {
  const [type, rest] = groupKey.split("|");
  const tuples = rest.split(";");
  const t = typeFn(type);
  return tuples.map((tuple) => {
    const [count, fullKey] = tuple.split(":");
    const [key, level, warden] = fullKey.split("/");
    return `${count} ${t(key, level, warden)}`;
  });
};

const GroupedParties = ({ groups }) => {
  return (
    <Stack>
      {groups.map(([groupKey, parties]) => {
        const makeup = humanizeGroupKey(groupKey);

        return (
          <div key={groupKey}>
            <List>
              {makeup.map((key) => (
                <List.Item key={key}>{key}</List.Item>
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

export const PartyFinderResults = () => {
  const { size, parties, groupBy } = useFindPartiesResults();

  const groups = useMemo(() => {
    return (
      groupBy &&
      Object.entries(
        parties.reduce((acc, party) => {
          acc[party.groupKey] ||= [];
          acc[party.groupKey].push(party);
          return acc;
        }, {}),
      )
    );
  }, [parties, groupBy]);

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
