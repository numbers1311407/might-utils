import { Stack } from "@mantine/core";
import { PageTitle } from "@/core/components";
import * as titles from "@/config/constants/titles";
import {
  TierSelect,
  MightRangeFinder as MightRangeFinderComponent,
  useCalculatorContext,
} from "@/core/calculators";

export const MightRangeFinder = () => {
  const { difficulty, setDifficulty, setInstance, instance } =
    useCalculatorContext();

  return (
    <Stack>
      <PageTitle
        section={titles.CALCULATORS_CATEGORY}
        title={titles.MIGHT_RANGE_FINDER_TITLE}
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
