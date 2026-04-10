import { Button, NumberInput, Stack, Text } from "@mantine/core";
import { usePersistedFloatingWindowHandle } from "@/core/hooks";
import { FloatingWindow } from "@/core/components";
import { useRoute } from "wouter";
import { NpcSimulator as NpcSimulatorComponent } from "./NpcSimulator.jsx";
import { TierSelect } from "./TierSelect.jsx";
import { useCalculatorContext } from "./calculator-context.js";

const NAME = "npc-simulator";
const HELP =
  "This calculator attempts to predict what instance options the NPCs will offer " +
  "you for each tier given your might score.";

export const useFloatingNpcSimulator = () => {
  return usePersistedFloatingWindowHandle(NAME);
};

export const FloatingNpcSimulator = () => {
  const { api } = useFloatingNpcSimulator();
  const [match] = useRoute("/parties/*?");
  const { might, setMight, setInstance, instance } = useCalculatorContext();

  return (
    <>
      <Button size="compact-md" onClick={api.toggle}>
        NPC Sim
      </Button>
      <FloatingWindow
        name={NAME}
        w={450}
        help={HELP}
        p="lg"
        title="Instance NPC Simulator"
      >
        <Stack gap="xs">
          <TierSelect
            value={instance}
            onChange={setInstance}
            w={400}
            zIndex={500}
          />
          <NumberInput
            value={might}
            onChange={(value) => setMight(value)}
            placeholder="Your party's might"
            disabled={match}
            description={match && "Tracking the current party's might"}
            step={10}
            size="md"
            styles={{
              description: {
                fontSize: 13,
                color: "var(--mantine-color-warning-5)",
              },
              input: {
                paddingLeft: 70,
              },
            }}
            leftSectionWidth={60}
            leftSectionProps={{
              style: {
                background: "var(--mantine-color-default-border)",
              },
            }}
            leftSection="Might"
            w={400}
          />
          <NpcSimulatorComponent instance={instance} might={might} />
        </Stack>
      </FloatingWindow>
    </>
  );
};
