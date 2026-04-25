import { Stack, Title, Text } from "@mantine/core";
import * as titles from "@/config/constants/titles";
import { AppLink, Aside, PageTitle } from "@/core/components";
import {
  TierSelect,
  useCalculatorContext,
  CalculatorMightInput,
  NpcSimulator as NpcSimulatorComponent,
} from "@/core/calculators";

export const NpcSimulator = () => {
  const { might, instance, setInstance } = useCalculatorContext();

  return (
    <Stack gap={0}>
      <PageTitle
        section={titles.CALCULATORS_CATEGORY}
        title={titles.NPC_SIMULATOR_TITLE}
        subtitle="Know what Suki has to say before you're in hail distance"
      />
      <Stack
        py={{ base: 0, md: "lg" }}
        style={{ width: "100%", maxWidth: 650 }}
      >
        <TierSelect value={instance} onChange={setInstance} />
        <CalculatorMightInput />
        <NpcSimulatorComponent instance={instance} might={might} />
      </Stack>
      <Aside>
        <Stack gap="sm">
          <Title order={4} c="primary">
            What is this?
          </Title>
          <Text>
            The instance NPC simulator is a calculator that takes a tier and a
            might score and returns a list of options for the difficulties and
            respective auras that would be granted for that tier and score.
          </Text>
          <Text>
            It's modeled on how the interaction with the NPC for that specific
            tier would look.
          </Text>
          <Text>
            You can summon a floating version of this calculator at any time
            from the floating tools panel on the bottom of the screen.
          </Text>
          <Text>
            On <AppLink href="/parties">party details pages</AppLink>, the might
            input will track the score of the current party, so you can
            experiment with your party's might and see the result.
          </Text>
        </Stack>
      </Aside>
    </Stack>
  );
};
