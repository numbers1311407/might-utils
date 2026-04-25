import { NumberInput, Stack } from "@mantine/core";
import * as titles from "@/config/constants/titles";
import { PageTitle } from "@/core/components";
import {
  TierSelect,
  useCalculatorContext,
  CalculatorMightInput,
  NpcSimulator as NpcSimulatorComponent,
} from "@/core/calculators";

export const NpcSimulator = () => {
  const { might, instance, setInstance } = useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section={titles.CALCULATORS_CATEGORY}
        title={titles.NPC_SIMULATOR_TITLE}
        subtitle="Know what Suki has to say before you're in hail distance"
      />
      <TierSelect value={instance} onChange={setInstance} w={400} />
      <Stack>
        <CalculatorMightInput />
        <NpcSimulatorComponent instance={instance} might={might} />
      </Stack>
    </Stack>
  );
};
