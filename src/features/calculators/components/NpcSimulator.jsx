import { NumberInput, Stack } from "@mantine/core";
import { PageTitle } from "@/core/components";
import {
  TierSelect,
  useCalculatorContext,
  NpcSimulator as NpcSimulatorComponent,
} from "@/core/components/calculators";

export const NpcSimulator = () => {
  const { might, setMight, instance, setInstance } = useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section="Planning & Data"
        title="Instance NPC Simulator"
        subtitle="Know what Suki has to say before you're in hail distance"
      />
      <TierSelect value={instance} onChange={setInstance} w={400} />
      <Stack>
        <NumberInput
          value={might}
          onChange={(value) => setMight(value)}
          placeholder="Enter Might"
          step={10}
          size="md"
          w={400}
        />
        <NpcSimulatorComponent instance={instance} might={might} />
      </Stack>
    </Stack>
  );
};
