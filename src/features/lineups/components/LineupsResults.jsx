import { useMemo } from "react";
import { Table, Text, Container } from "@mantine/core";
import { humanizeTag } from "@/common/tags";
import { useFindLineupsResults } from "../hooks";

const getGroupTitle = (group) => {
  return group
    .split(";")
    .map((t) => {
      const [tag, levelr, count] = t.split(":");
      const [level, rank] = levelr.split("+");
      const isLevelTag = tag.startsWith("l-");
      return `${count} ${isLevelTag ? "Level" : humanizeTag(tag)} ${level}${rank === "0" ? "" : `rk${rank}`}`;
    })
    .join(", ");
};

const GroupedLineups = ({ groups }) => {
  return groups.map(([group, lineups]) => (
    <Container key={group}>
      <Text px="xs">{getGroupTitle(group)}</Text>
      <LineupsTable lineups={lineups} />
    </Container>
  ));
};

const LineupsTable = ({ lineups }) => (
  <Table>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Score</Table.Th>
        <Table.Th>Size</Table.Th>
        <Table.Th>Lineup</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {lineups.map((lineup, index) => (
        <Table.Tr key={index}>
          <Table.Td>{lineup.score}</Table.Td>
          <Table.Td>{lineup.size}</Table.Td>
          <Table.Td>
            {lineup.lineup
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

export const LineupsResults = () => {
  const { size, lineups, grouped } = useFindLineupsResults();

  const groups = useMemo(() => {
    return (
      grouped &&
      Object.entries(
        lineups.reduce((acc, lineup) => {
          acc[lineup.group] ||= [];
          acc[lineup.group].push(lineup);
          return acc;
        }, {}),
      )
    );
  }, [lineups, grouped]);

  return (
    <>
      <Text py="sm" px="xs">
        {size} Results
        {grouped && ` in ${groups.length} level/rank configurations`}
      </Text>
      {grouped ? (
        <GroupedLineups groups={groups} />
      ) : (
        <LineupsTable lineups={lineups} />
      )}
    </>
  );
};
