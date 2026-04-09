import { Button, Stack } from "@mantine/core";
import { usePersistedFloatingWindowHandle } from "@/core/hooks";
import { FloatingWindow } from "@/core/components";
import { MightRangeFinder as MightRangeFinderComponent } from "./MightRangeFinder.jsx";
import { TierSelect } from "./TierSelect.jsx";
import { useCalculatorContext } from "./calculator-context.js";

const NAME = "might-range-finder";
const HELP =
  "This calculator takes a tier and difficulty level and attempts to predict the might " +
  "ranges you'd need to hit that difficulty.";

export const useFloatingMightRangeFinder = () => {
  return usePersistedFloatingWindowHandle(NAME);
};

export const FloatingMightRangeFinder = () => {
  const { api } = useFloatingMightRangeFinder();
  const { difficulty, setDifficulty, setInstance, instance } =
    useCalculatorContext();

  return (
    <>
      <Button size="compact-md" onClick={api.toggle}>
        Might Range
      </Button>
      <FloatingWindow
        name={NAME}
        w={450}
        help={HELP}
        p="lg"
        title="Might Range Finder"
      >
        <Stack gap="xs">
          <TierSelect
            value={instance}
            onChange={setInstance}
            w={400}
            zIndex={500}
          />
          <MightRangeFinderComponent
            instance={instance}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </Stack>
      </FloatingWindow>
    </>
  );
};
