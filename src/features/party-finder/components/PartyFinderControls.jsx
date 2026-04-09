import { Divider, Group, Stack } from "@mantine/core";
import { useThrottledCallback } from "@mantine/hooks";
import { ActiveTagFiltersSelect, NumberField } from "@/core/components";
import { MightMaxLevel, MightMinLevel } from "@/core/config/might";
import { usePartyFinderStore } from "../store";
import { ResultsGroupingSelect } from "./ResultsGroupingSelect.jsx";

export const PartyOptionInput = ({ option, ...restProps }) => {
  const setOption = usePartyFinderStore((store) => store.setOption);
  const options = usePartyFinderStore((store) => store.options);
  const value = options[option];
  const setValue = useThrottledCallback((value) => {
    setOption(option, value === "" ? undefined : value);
  }, 400);
  return <NumberField value={value} setValue={setValue} {...restProps} />;
};

const MaxLevelInput = (props) => (
  <PartyOptionInput
    option="maxLevel"
    label="Max Char Level"
    placeholder="The carries"
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MinLevelInput = (props) => (
  <PartyOptionInput
    option="minLevel"
    label="Min Char Level"
    placeholder="The twinks"
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MaxSizeInput = (props) => (
  <PartyOptionInput
    option="maxSize"
    label="Max Party Size"
    placeholder="Big party"
    min={1}
    max={20}
    {...props}
  />
);

const MinSizeInput = (props) => (
  <PartyOptionInput
    option="minSize"
    label="Min Party Size"
    placeholder="Lil' party"
    min={1}
    max={20}
    {...props}
  />
);

const MarginInput = (props) => (
  <PartyOptionInput
    option="margin"
    label="Target Tolerance"
    help="Acceptable deviation under your target score. Must be higher than the lowest might score on your roster."
    placeholder="Close enough?"
    min={0}
    step={5}
    {...props}
  />
);

const TargetScoreInput = (props) => (
  <PartyOptionInput
    option="targetScore"
    label="Targe Might Score"
    description="What might score are you trying to hit?"
    placeholder="Enter Target Might"
    type="number"
    min={0}
    step={10}
    {...props}
  />
);

export const PartyFinderControls = () => {
  return (
    <>
      <Stack
        gap={8}
        bg="light-dark(var(--mantine-color-blue-3), var(--mantine-color-red-8))"
        p="sm"
        bdrs="sm"
      >
        <TargetScoreInput />
        <MarginInput />
        <Divider m="md" />
        <ResultsGroupingSelect />
        <ActiveTagFiltersSelect />
        <Divider m="md" />
        <Group wrap="nowrap">
          <MinLevelInput />
          <MaxLevelInput />
        </Group>
        <Group wrap="nowrap">
          <MinSizeInput />
          <MaxSizeInput />
        </Group>
      </Stack>
    </>
  );
};
