import {
  Box,
  NumberInput,
  Divider,
  Stack,
  Group,
  Text,
  List,
} from "@mantine/core";
import {
  simulateInstanceNPC,
  getTargetMightRanges,
  humanizeOffering,
} from "@/core/instances";

import { capitalize } from "@/utils";
import { TierSelect, DifficultySelect } from "./TierSelect.jsx";
import { PageTitle } from "@/core/components";
import { useState } from "react";

const sayings = {
  T6: {
    npc: "Gruub",
    saying: <>Gruub says, 'hzzz... speak up before I nap.'</>,
  },
  T7: {
    npc: "Flamsy",
    saying: (
      <>
        Flamsy says, 'Speak up! Do you need to learn more about{" "}
        <Text span c="magenta">
          [The Fabled Nagafen's Lair]
        </Text>
        ?'
      </>
    ),
  },
  T8: {
    npc: "Thorne Darkholme",
    saying: (
      <>
        Thorne Darkholme says, 'Would you like to learn more about the{" "}
        <Text span c="magenta">
          [content of the Spider Den]
        </Text>
        ?'
      </>
    ),
  },
  T9: {
    npc: "Howard",
    saying: (
      <>
        Howard says, 'Would you like to learn more about{" "}
        <Text span c="magenta">
          [The Bloodied Quarries]
        </Text>
        ?'
      </>
    ),
  },
  T10: {
    npc: "Suki the Cobra",
    saying: (
      <>
        Suki the Cobra says, 'Are you unfamiliar with{" "}
        <Text span c="magenta">
          [vampires]
        </Text>
        ?'
      </>
    ),
  },
};

export const InstanceCalculator = () => {
  const [instance, setInstance] = useState({
    tier: "T9",
    type: "raid",
    might: 1600,
  });
  const [might, setMight] = useState(1600);
  const [diff, setDiff] = useState("N");
  const intense = (instance.type === "raid" ? 0.48 : 0.64) * instance.might;

  return (
    <Stack>
      <PageTitle title="Instance Calculator" subtitle="Predict what Suki has to say before you're in hail distance" />
      <Stack>
        <TierSelect
          value={Object.values(instance).join(":")}
          onChange={setInstance}
          w={400}
        />
      </Stack>
      <Group gap="lg" align="flex-start">
        <Stack flex="1">
          <NumberInput
            value={might}
            onChange={(value) => setMight(value)}
            placeholder="Enter Might"
            step={10}
            size="md"
          />

          {might && instance.might && (
            <Box
              bg="slate.8"
              c="goldenrod"
              p="sm"
              size="xs"
              component={Stack}
              gap={0}
              style={{ fontFamily: "Arial, Sans" }}
            >
              {sayings[instance.tier] && (
                <>
                  <Text size="sm" c="white">
                    You say, 'Hail {sayings[instance.tier].npc}'
                  </Text>
                  <Text size="sm">{sayings[instance.tier].saying}</Text>
                </>
              )}
              <Text size="sm">Your party's Might: {might}.</Text>
              <Box
                my={6}
                w="58%"
                style={{
                  borderBottom: "1px solid var(--mantine-color-yellow-5)",
                }}
              />
              <Text size="sm">
                Your options for {capitalize(instance.type)} instances
                (Suggested Might: {instance.might}, Maximum for Intense:{" "}
                {intense}):
              </Text>
              {simulateInstanceNPC(
                instance.type,
                instance.might,
                might,
                instance.tier,
              ).map((line, i) => (
                <Text size="sm" key={line}>
                  {line}
                </Text>
              ))}
              <Box
                my={6}
                w="58%"
                style={{
                  borderBottom: "1px solid var(--mantine-color-yellow-5)",
                }}
              />
            </Box>
          )}
        </Stack>
        <Stack flex="1">
          <DifficultySelect value={diff} onChange={setDiff} />
          {diff && instance.might && (
            <Stack>
              <Text size="sm">Chosen Difficulty: {diff}</Text>
              <List size="sm">
                {getTargetMightRanges(instance.type, instance.might, diff)
                  .sort((a, b) => a.minMight - b.minMight)
                  .map((line, i) => (
                    <List.Item key={i}>
                      {humanizeOffering({ ...line, difficulty: diff })}{" "}
                      {line.minMight}-{line.maxMight}
                    </List.Item>
                  ))}
              </List>
            </Stack>
          )}
        </Stack>
      </Group>
    </Stack>
  );
};
