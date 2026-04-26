import { Stack, Title, Text } from "@mantine/core";
import { AppLink, Aside, PageTitle } from "@/core/components";
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
    <Stack gap={0}>
      <PageTitle
        section={titles.CALCULATORS_CATEGORY}
        title={titles.MIGHT_RANGE_FINDER_TITLE}
        subtitle="Look up might ranges by tier and desired difficulty"
      />
      <Stack
        py={{ base: 0, md: "lg" }}
        style={{ width: "100%", maxWidth: 650 }}
      >
        <TierSelect value={instance} onChange={setInstance} />
        <MightRangeFinderComponent
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          instance={instance}
        />
      </Stack>
      <Aside visibleFrom="sm">
        <Stack gap="sm">
          <Title order={4} c="primary">
            What is this?
          </Title>
          <Text>
            The might range finder is a calculator that takes a tier and a
            desired difficulty and returns the party might ranges you'd need to
            be offered that difficulty, and the respective aura granted at each
            range.
          </Text>
          <Text>
            For convenience the calculator returns links to search for the top
            end of each range in the party generator.
          </Text>
          <Text>
            You can summon a floating version of this calculator at any time
            from the floating tools panel on the bottom of the screen.
          </Text>
        </Stack>
      </Aside>
    </Stack>
  );
};
