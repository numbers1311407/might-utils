import { NumberInput, Stack, Text, List } from "@mantine/core";
import { useRoute } from "wouter";
import { getTargetMightRanges, humanizeOffering } from "@/core/instances";
import { PageTitle } from "@/core/components";
import {
  TierSelect,
  DifficultySelect,
  useCalculatorContext,
  CalculatorContextProvider,
  NpcSimulator as NpcSimulatorMain,
} from "@/core/components/calculators";

export const NpcSimulator = ({ children }) => {
  const { might, setMight, instance, maxIntense } = useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section="Planning & Data"
        title="Instance NPC Simulator"
        subtitle="Know what Suki has to say before you're in hail distance"
      />
      {children}
      <Stack>
        <NumberInput
          value={might}
          onChange={(value) => setMight(value)}
          placeholder="Enter Might"
          step={10}
          size="md"
          w={400}
        />
        <NpcSimulatorMain
          instance={instance}
          might={might}
          maxIntense={maxIntense}
        />
      </Stack>
    </Stack>
  );
};

export const MightRangeCalculator = ({ children }) => {
  const { difficulty, setDifficulty, instance } = useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section="Planning & Data"
        title="Might Range Finder"
        subtitle="Look up might ranges by tier and desired difficulty"
      />
      {children}
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

export const InstanceCalculatorMain = () => {
  const { instance, setInstance } = useCalculatorContext();
  const [isSimulator] = useRoute("/npc-simulator");
  const Page = isSimulator ? NpcSimulator : MightRangeCalculator;

  return (
    <Page>
      <TierSelect value={instance} onChange={setInstance} w={400} />
    </Page>
  );
};

export const InstanceCalculator = () => {
  return (
    <CalculatorContextProvider>
      <InstanceCalculatorMain />
    </CalculatorContextProvider>
  );
};
