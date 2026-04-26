import { Fragment, useMemo } from "react";
import {
  Box,
  Group,
  Paper,
  Stack,
  ScrollArea,
  Grid,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  getTargetMightRanges,
  humanizeAura,
  humanizeDifficulty,
} from "@/core/calculators";
import { AppLink } from "@/core/components";
import { useRoster } from "@/core/hooks";
import { DifficultySelect } from "./TierSelect";
import { capitalize } from "@/utils";
import { IconAwardFilled as IconMedal } from "@tabler/icons-react";
import { CalculatorDisclaimer } from "./CalculatorDisclaimer";

const MEDAL_COLORS = {
  gold: "yellow.4",
  silver: "gray.4",
  bronze: "yellow.5",
  platinum: "blue.3",
};

const Medal = ({ medal }) => {
  return (
    <Box c={MEDAL_COLORS[medal]} display="inline-flex">
      <IconMedal size={18} />
    </Box>
  );
};

const useRosterMinMight = () => {
  const roster = useRoster({ activeOnly: true });
  return useMemo(() => {
    return Math.min(...roster.map(({ might }) => might));
  }, [roster]);
};

export const MightRangeFinder = ({
  difficulty,
  setDifficulty,
  instance,
  resultsHeight = "auto",
  size = "md",
  compact = false,
  rowPadding = 3,
  ...stackProps
}) => {
  const colProps = {
    style: { borderBottom: "1px dashed var(--paper-border-color-custom)" },
    align: "center",
    py: rowPadding,
  };

  const rosterMinMight = useRosterMinMight();
  const defaultMargin = 50;

  const generatorHref = ({ minMight, maxMight }) => {
    const targetScore =
      rosterMinMight >= 5 ? maxMight : Math.floor(maxMight / 5) * 5;
    const margin = Math.min(
      maxMight - minMight,
      rosterMinMight - 1, // -1 because margin has to be > the lowest char's might
      defaultMargin,
    );
    return `/party-generator?targetScore=${targetScore}&margin=${margin}`;
  };

  return (
    <Stack {...stackProps}>
      <DifficultySelect value={difficulty} onChange={setDifficulty} />
      <Paper p="md">
        <Stack gap="xs">
          <Text size={size}>
            Estimated ranges for difficulty{" "}
            <Text size={size} c="primary" span>
              {humanizeDifficulty(difficulty)}
            </Text>
            :
          </Text>
          <ScrollArea.Autosize
            mah={resultsHeight}
            type={resultsHeight > 0 ? "always" : "auto"}
            overscrollBehavior="contain"
            scrollbars="y"
          >
            <Grid gap={0}>
              {getTargetMightRanges(instance.type, instance.might, difficulty)
                .sort((a, b) => a.minMight - b.minMight)
                .map((line, i) => (
                  <Fragment key={i}>
                    <Grid.Col
                      span={compact ? 1 : { base: 1, sm: 3 }}
                      component={Group}
                      c={MEDAL_COLORS[line.medal]}
                      gap={6}
                      {...colProps}
                    >
                      <Medal medal={line.medal} />
                      <Text
                        display={compact ? "none" : "block"}
                        size={size}
                        visibleFrom="sm"
                      >
                        {capitalize(line.medal)}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6} {...colProps}>
                      <Text size={size}>{humanizeAura(line.aura)}</Text>
                    </Grid.Col>
                    <Grid.Col
                      span={compact ? 5 : { base: 5, sm: 3 }}
                      ta="right"
                      pr={resultsHeight > 0 ? 18 : undefined}
                      {...colProps}
                    >
                      <Text
                        component={AppLink}
                        size={size}
                        ff="mono"
                        href={generatorHref(line)}
                      >
                        {line.minMight}-{line.maxMight}
                      </Text>
                    </Grid.Col>
                  </Fragment>
                ))}
            </Grid>
          </ScrollArea.Autosize>
          <CalculatorDisclaimer />
        </Stack>
      </Paper>
    </Stack>
  );
};
