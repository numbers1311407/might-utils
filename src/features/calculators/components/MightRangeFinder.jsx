import { Stack, Text, List } from "@mantine/core";
import { getTargetMightRanges, humanizeOffering } from "@/core/instances";
import { PageTitle } from "@/core/components";
import {
  TierSelect,
  DifficultySelect,
  useCalculatorContext,
  CalculatorContextProvider,
} from "@/core/components/calculators";

const MightRangeFinderMain = () => {
  const { difficulty, setDifficulty, setInstance, instance } =
    useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section="Planning & Data"
        title="Might Range Finder"
        subtitle="Look up might ranges by tier and desired difficulty"
      />
      <TierSelect value={instance} onChange={setInstance} w={400} />
      <Stack>
        <DifficultySelect value={difficulty} onChange={setDifficulty} w={400} />
        {difficulty && instance.might && (
          <Stack>
            <Text size="sm">Chosen Difficulty: {difficulty}</Text>
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
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export const MightRangeFinder = () => {
  return (
    <CalculatorContextProvider>
      <MightRangeFinderMain />
    </CalculatorContextProvider>
  );
};
