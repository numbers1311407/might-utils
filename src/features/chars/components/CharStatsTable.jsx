import { Group, Stack, Table, Text } from "@mantine/core";
import { useMemo } from "react";
import { CharCounts, WardenCharCounts, TagCharCounts } from "./CharCounts.jsx";

const Tags = ({ children }) => <Group gap={10}>{children}</Group>;

export const CharStatsTable = ({
  stats,
  mode = "vertical",
  minMight = false,
}) => {
  const rows = useMemo(() => {
    if (!stats) return [];

    return [
      ["Count", <Text c="primary">{stats.size} members</Text>],
      [
        "Might",
        <Text>
          <Text span c="primary.4">
            {stats.might.total} {minMight ? "max" : ""}
          </Text>
          {minMight && (
            <>
              {" / "}
              <Text span c="primary.5">
                {stats.might.minTotal}
              </Text>
            </>
          )}
          {" / "}
          <Text span c="dark">
            {stats.might.avg} avg
          </Text>
        </Text>,
      ],
      [
        "Level",
        <Stack gap="md">
          <Text>
            <Text span c="primary">
              {stats.level.min} - {stats.level.max} range
            </Text>
            {" / "}
            <Text span c="dark">
              {stats.level.avg} avg
            </Text>
          </Text>
          <Tags>
            <WardenCharCounts chars={stats.level.chars} />
          </Tags>
        </Stack>,
      ],
      [
        "Warden",
        <Tags>
          <WardenCharCounts chars={stats.warden.chars} />
        </Tags>,
      ],
      [
        "Classes",
        <Tags>
          <CharCounts
            chars={stats.class.chars}
            renderValue={(val) => val.toLowerCase()}
          />
        </Tags>,
      ],
      [
        "Tags",
        <Tags>
          <TagCharCounts chars={stats.tags.chars} />
        </Tags>,
      ],
    ];
  }, [stats, minMight]);

  return (
    <Table align="top" mb="md" withColumnBorders>
      <Table.Tbody>
        {rows.map((row) => (
          <Table.Tr key={row[0]} style={{ verticalAlign: "top" }}>
            {mode === "vertical" && (
              <>
                <Table.Td pl={0} py="sm" w="25%">
                  <Text fw="bold">{row[0]}</Text>
                </Table.Td>
                <Table.Td pr={0} py="sm" w="75%">
                  {row[1]}
                </Table.Td>
              </>
            )}
            {mode === "stacked" && (
              <>
                <Table.Td px={0} py="sm">
                  <Stack gap="sm">
                    <Text size="lg" fw="bold" mb={0}>
                      {row[0]}
                    </Text>
                    {row[1]}
                  </Stack>
                </Table.Td>
              </>
            )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
