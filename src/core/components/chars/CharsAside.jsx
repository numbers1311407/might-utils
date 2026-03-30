import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Group,
  Stack,
  SegmentedControl,
  Table,
  Text,
} from "@mantine/core";
import { getCharMight } from "@/core/chars";
import { useClassTagsStore, useRoster } from "@/core/store";
import { AppLink, Aside } from "@/core/components/common";

export const CharsAside = ({ chars, isRoster, ...asideProps }) => {
  const { activeOnly, setActiveOnly } = useRoster();
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

  return (
    <Aside component={Stack} {...asideProps}>
      {isRoster && (
        <SegmentedControl
          mt="xs"
          value={activeOnly}
          size="sm"
          fullWidth
          data={[
            { label: "Show All", value: false },
            { label: "Show Active only", value: true },
          ]}
          onChange={setActiveOnly}
        />
      )}
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
                <Table.Td c="yellow.5">{totalMight.low}</Table.Td>
                <Table.Td c="yellow.3">{totalMight.high}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr>
                <Table.Td colspan={2}>* Dependent on warden status</Table.Td>
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
                <Table.Td c="yellow.4">{totalMight.high}</Table.Td>
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
              <Group gap={8}>
                {!tagCloud.length && <Text>None</Text>}
                {tagCloud.map(({ tag, count }) => (
                  <Flex gap={2} key={tag}>
                    <Text span c="gold">
                      {count}
                    </Text>
                    <Text span c="yellow.5">
                      x
                    </Text>
                    <Text span c="gold" fs="italic">
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
