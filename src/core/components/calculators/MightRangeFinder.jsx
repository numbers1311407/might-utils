import { Stack, Text, List } from "@mantine/core";
import { getTargetMightRanges, humanizeOffering } from "@/core/instances";
import { DifficultySelect } from "./TierSelect";

export const MightRangeFinder = ({
  difficulty,
  setDifficulty,
  instance,
  ...stackProps
}) => {
  return (
    <Stack {...stackProps}>
      <DifficultySelect value={difficulty} onChange={setDifficulty} w={400} />
      <Stack>
        <Text size="md">
          Estimated medal and aura ranges for this difficulty:
        </Text>
        <List size="sm">
          {getTargetMightRanges(instance.type, instance.might, difficulty)
            .sort((a, b) => a.minMight - b.minMight)
            .map((line, i) => (
              <List.Item key={i}>
                {humanizeOffering({ ...line, difficulty })} {line.minMight}-
                {line.maxMight}
              </List.Item>
            ))}
        </List>
        <Text size="sm" c="dark">
          <Text span fw="bold">
            Warning:
          </Text>{" "}
          This output is experimental and may be inaccurate.
        </Text>
      </Stack>
    </Stack>
  );
};
