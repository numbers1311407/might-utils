import { Group, Stack, Table, Text } from "@mantine/core";
import { useMemo } from "react";
import { CharCounts, WardenCharCounts, TagCharCounts } from "./CharCounts.jsx";

export const StatsTable = ({ stats }) => {
  const rows = useMemo(() => {
    if (!stats) return [];

    return [
      ["Size", <Text c="primary">{stats.size}</Text>],
      [
        "Might",
        <Text>
          <Text span c="primary">
            {stats.might.total}
          </Text>
          {" / "}
          <Text span c="dark">
            {stats.might.avg} avg
          </Text>
        </Text>,
      ],
      [
        "Level",
        <Stack gap={4}>
          <Text>
            <Text span c="primary">
              {stats.level.min} - {stats.level.max}
            </Text>
            {" / "}
            <Text span c="dark">
              {stats.level.avg} avg
            </Text>
          </Text>
          <Group gap={6}>
            <WardenCharCounts chars={stats.level.chars} />
          </Group>
        </Stack>,
      ],
      [
        "Warden",
        <Group gap={6}>
          <WardenCharCounts chars={stats.warden.chars} />
        </Group>,
      ],
      [
        "Classes",
        <Group gap={6}>
          <CharCounts chars={stats.class.chars} />
        </Group>,
      ],
      [
        "Tags",
        <Group gap={6}>
          <TagCharCounts chars={stats.tags.chars} />
        </Group>,
      ],
    ];
  }, [stats]);

  return (
    <Table align="top" withTableBorder mb="md">
      <Table.Tbody>
        {rows.map((row) => (
          <Table.Tr key={row[0]} style={{ verticalAlign: "top" }}>
            <Table.Td w="25%">
              <Text>{row[0]}</Text>
            </Table.Td>
            <Table.Td w="75%">{row[1]}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
