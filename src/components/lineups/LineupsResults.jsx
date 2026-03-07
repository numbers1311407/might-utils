import { useMemo } from "react";
import { Table, Text, Container } from "@mantine/core";
import { useFindLineupsResults } from "@/lib/lineups";

const acronyms = new Set(["dps", "rdps", "mdps"]);
const humanizeTag = (tag) => {
  const [type, value] = tag.split("-");
  switch (type) {
    case "c":
      return value.toUpperCase();
    case "t":
    case "l":
    default:
      return acronyms.has(value)
        ? value.toUpperCase()
        : value.replace(/^./, (l) => l.toUpperCase());
  }
};

const getGroupTitle = (group) => {
  return group
    .split(";")
    .map((term) => {
      const [tag, levelr, count] = term.split(":");
      const [level, rank] = levelr.split("+");
      return `${count} ${humanizeTag(tag)} ${level}${rank === "0" ? "" : `rk${rank}`}`;
    })
    .join(", ");
};

const GroupedLineups = ({ lineups }) => {
  const groups = useMemo(() => {
    return lineups.reduce((acc, lineup) => {
      acc[lineup.group] ||= [];
      acc[lineup.group].push(lineup);
      return acc;
    }, {});
  }, [lineups]);

  return (
    <>
      {Object.entries(groups).map(([group, lineups]) => (
        <Container key={group}>
          <Text>{getGroupTitle(group)}</Text>
          <LineupsTable lineups={lineups} />
        </Container>
      ))}
    </>
  );
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

  return (
    <>
      <Text py="sm" px="xs">
        {size} Results
      </Text>
      {grouped ? (
        <GroupedLineups lineups={lineups} />
      ) : (
        <LineupsTable lineups={lineups} />
      )}
    </>
  );
};
