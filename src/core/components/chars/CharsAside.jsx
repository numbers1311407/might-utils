import { useMemo } from "react";
import {
  Flex,
  Group,
  Stack,
  SegmentedControl,
  Table,
  Text,
} from "@mantine/core";
import { useRosterControls } from "@/core/hooks";
import { getCharMight } from "@/core/chars";
import { useClassTagsStore } from "@/core/store";
import { AppLink, Aside } from "@/core/components/common";

export const CharsAside = ({ chars, isRoster, ...asideProps }) => {
  const { activeOnly, setActiveOnly } = useRosterControls();
  const classTags = useClassTagsStore((store) => store.tags);
  const tagCloud = useMemo(() => {
    const counts = {};
    for (const char of chars) {
      if (activeOnly && !char.active) continue;

      for (const tag of char.tags) {
        counts[tag] = Number(counts[tag] || 0) + 1;
      }
      for (const tag of classTags[char.class]) {
        counts[tag] = Number(counts[tag] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [activeOnly, chars, classTags]);

  const totalMight = useMemo(() => {
    return chars.reduce(
      (acc, char) => {
        if (!activeOnly || char.active) {
          acc.low += getCharMight(char, 0);
          acc.high += getCharMight(char);
        }
        return acc;
      },
      { low: 0, high: 0 },
    );
  }, [activeOnly, chars]);

  const avgLevel = useMemo(() => {
    if (!chars.length) return "n/a";

    return Math.round(
      chars.reduce((sum, char) => (sum += char.level), 0) / chars.length,
    );
  }, [chars]);

  const levels = useMemo(() => {
    if (!chars.length) return "n/a";

    return chars
      .reduce(
        (acc, char) => [
          Math.min(acc[0], char.level),
          Math.max(acc[1], char.level),
        ],
        [chars[0].level, chars[0].level],
      )
      .join("-");
  }, [chars]);

  return (
    <Aside component={Stack} {...asideProps}>
      {isRoster && (
        <SegmentedControl
          value={activeOnly}
          size="sm"
          fullWidth
          data={[
            { label: "Show All", value: false },
            { label: "Hide Inactive", value: true },
          ]}
          onChange={setActiveOnly}
        />
      )}
      <Table variant="vertical" withTableBorder>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th width="50%">Count:</Table.Th>
            <Table.Td c="yellow.5" ta="right">
              <Text size="lg" ff="mono">
                {chars.length}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Level range:</Table.Th>
            <Table.Td c="yellow.5" ta="right">
              <Text size="lg" ff="mono">
                {levels}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Average level:</Table.Th>
            <Table.Td c="yellow.5" ta="right">
              <Text size="lg" ff="mono">
                {avgLevel}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Table withTableBorder withColumnBorders>
        {isRoster ? (
          <>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="50%">Min Might *</Table.Th>
                <Table.Th w="50%">Max Might *</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td c="yellow.7" ff="mono">
                  <Text size="lg">{totalMight.low}</Text>
                </Table.Td>
                <Table.Td c="yellow.5" ff="mono">
                  <Text size="lg">{totalMight.high}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr>
                <Table.Td colSpan={2}>* Dependent on warden status</Table.Td>
              </Table.Tr>
            </Table.Tfoot>
          </>
        ) : (
          <>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="50%">Combined Might</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td c="yellow.7">{totalMight.high}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </>
        )}
      </Table>
      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tags</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Group gap={8} ts="lg">
                {!tagCloud.length && <Text>None</Text>}
                {tagCloud.map(({ tag, count }) => (
                  <Flex gap={2} key={tag}>
                    <Text span c="yellow.4">
                      {count}
                    </Text>
                    <Text span c="yellow.6">
                      x
                    </Text>
                    <Text span c="yellow.4" fs="italic">
                      {tag}
                    </Text>
                  </Flex>
                ))}
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
        {!!tagCloud.length && (
          <Table.Tfoot>
            <Table.Tr>
              <Table.Td>
                Includes class tags, which you can{" "}
                <AppLink href="/class-tags">edit here.</AppLink>
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
        )}
      </Table>
    </Aside>
  );
};
