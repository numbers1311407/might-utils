import { Stack, Text, List } from "@mantine/core";
import { PageTitle } from "@/core/components";
import {
  TierSelect,
  MightRangeFinder as MightRangeFinderComponent,
  useCalculatorContext,
} from "@/core/components/calculators";

export const MightRangeFinder = () => {
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
      <MightRangeFinderComponent
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        instance={instance}
      />
    </Stack>
  );
};
