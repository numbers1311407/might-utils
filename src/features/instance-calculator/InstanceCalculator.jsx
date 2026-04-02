import { Box, Stack, Group, Text, List } from "@mantine/core";
import {
  simulateInstanceNPC,
  getTargetMightRanges,
  humanizeOffering,
} from "@/core/instances";

import { PageTitle } from "@/core/components";

export const InstanceCalculator = () => {
  const m = 700;

  const simulateCalls = [
    ["group", 200, m],
    ["group", 500, m],
    ["group", 750, m],
    ["group", 1000, m],
    ["group", 1250, m],
    ["raid", 320, m],
    ["raid", 1600, m],
    ["raid", 2200, m],
  ];

  // const d = "H-";
  const d = "H";

  const getRangeCalls = [
    ["group", 200, d],
    ["group", 500, d],
    ["group", 750, d],
    ["group", 1000, d],
    ["group", 1250, d],
    ["raid", 320, d],
    ["raid", 1600, d],
    ["raid", 2200, d],
  ];

  return (
    <Stack>
      <PageTitle title="Instance Calculator" subtitle="Thanks Gemini" />
      <Group align="flex-start">
        {m && (
          <Stack>
            {simulateCalls.map(([type, s, p]) => (
              <Box key={[type, s, p].join("-")}>
                <Text size="sm">
                  {type}: Suggested Might: {s}, Party Might: {p}
                </Text>
                <List>
                  {simulateInstanceNPC(type, s, p).map((line, i) => (
                    <List.Item key={line}>{line}</List.Item>
                  ))}
                </List>
              </Box>
            ))}
          </Stack>
        )}
        {d && (
          <Stack>
            {getRangeCalls.map(([type, s, diff]) => (
              <Box key={[type, s, diff].join("-")}>
                <Text size="sm">
                  {type}: suggested Might: {s}, Diff: {diff}
                </Text>
                <List>
                  {getTargetMightRanges(type, s, diff)
                    .sort((a, b) => a.minMight - b.minMight)
                    .map((line, i) => (
                      <List.Item key={i}>
                        {humanizeOffering({ ...line, difficulty: diff })}{" "}
                        {line.minMight}-{line.maxMight}
                      </List.Item>
                    ))}
                </List>
              </Box>
            ))}
          </Stack>
        )}
      </Group>
    </Stack>
  );
};
