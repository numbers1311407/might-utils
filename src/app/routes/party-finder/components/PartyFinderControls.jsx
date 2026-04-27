import { useCallback, useMemo } from "react";
import { Group, Paper, Stack, InputWrapper, RangeSlider } from "@mantine/core";
import { useThrottledCallback } from "@mantine/hooks";
import { useDraftState, useStableCallback } from "@/core/hooks";
import { NumberField } from "@/core/components";
import { ActiveFilterRulesetsSelect } from "@/core/rulesets";
import { MightMaxLevel, MightMinLevel } from "@/config/might";
import { useRulesStore } from "@/model/store";
import { usePartyFinderStore } from "../store";
import { ResultsGroupingSelect } from "./ResultsGroupingSelect.jsx";

const usePartyOption = (option) => {
  const setOption = usePartyFinderStore((store) => store.setOption);
  const options = usePartyFinderStore((store) => store.options);
  const value = options[option];
  const setValue = useThrottledCallback((value) => {
    setOption(option, value === "" ? undefined : value);
  }, 400);

  return [value, setValue];
};

export const PartyOptionNumberField = ({ option, ...restProps }) => {
  const [value, setValue] = usePartyOption(option);
  return <NumberField value={value} setValue={setValue} {...restProps} />;
};

const MaxLevelInput = (props) => (
  <PartyOptionNumberField
    option="maxLevel"
    label="Max Char Level"
    placeholder="The carries"
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MinLevelInput = (props) => (
  <PartyOptionNumberField
    option="minLevel"
    label="Min Char Level"
    placeholder="The twinks"
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MarginInput = (props) => (
  <PartyOptionNumberField
    option="margin"
    label="Score Tolerance"
    help="Acceptable deviation under your target might score. Must be higher than the lowest might score on your roster."
    placeholder="Close enough?"
    min={0}
    step={5}
    {...props}
  />
);

const TargetScoreInput = (props) => (
  <PartyOptionNumberField
    option="targetScore"
    label="Target Might Score"
    description="What might score are you trying to hit?"
    placeholder="Enter Target Might"
    type="number"
    min={0}
    step={10}
    {...props}
  />
);

const SizeRangeInput = (props) => {
  const {
    label = "Party Size Range",
    inputProps = {},
    ...wrapperProps
  } = props;
  const showTwenty = useRulesStore((store) => store.groupSizeTwenty);
  const [minSize, setMinSize] = usePartyOption("minSize");
  const [maxSize, setMaxSize] = usePartyOption("maxSize");
  const [draftValue, setDraftValue] = useDraftState([minSize, maxSize]);

  const marks = useMemo(
    () =>
      [1, 3, 6, 9, 12].concat(showTwenty ? [15, 18, 20] : []).map((n) => ({
        value: n,
        label: n,
      })),
    [showTwenty],
  );

  const onChange = useStableCallback((value) => {
    setDraftValue(value);
  });

  const onChangeEnd = useCallback(
    ([min, max]) => {
      if (min !== minSize) setMinSize(min);
      if (max !== maxSize) setMaxSize(max);
    },
    [minSize, maxSize, setMinSize, setMaxSize],
  );

  const description =
    typeof minSize !== "number" || typeof maxSize !== "number"
      ? "Use the range to set min/max party size"
      : minSize === maxSize
        ? `Party size of exactly ${minSize}`
        : `Party size may range from ${minSize} to ${maxSize}`;

  return (
    <InputWrapper
      label={label}
      description={description}
      pb={24}
      {...wrapperProps}
    >
      <RangeSlider
        min={1}
        max={showTwenty ? 20 : 12}
        minRange={0}
        step={1}
        value={draftValue}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        marks={marks}
        py={8}
        {...inputProps}
      />
    </InputWrapper>
  );
};

export const PartyFinderControls = () => {
  return (
    <Stack>
      <Paper component={Stack} gap={8} p="sm" bdrs="sm">
        <TargetScoreInput />
        <MarginInput />
        <Group wrap="nowrap">
          <MinLevelInput />
          <MaxLevelInput />
        </Group>
        <SizeRangeInput />
      </Paper>
      <Paper component={Stack} gap={8} p="sm" bdrs="sm">
        <ResultsGroupingSelect />
        <ActiveFilterRulesetsSelect />
      </Paper>
    </Stack>
  );
};
