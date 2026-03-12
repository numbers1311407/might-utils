import { Stack } from "@mantine/core";
import { NumberField } from "@/common/components";
import { MightMaxLevel, MightMinLevel } from "@/common/might";
import { useLineupsStore } from "../store.js";

export const LineupOptionInput = ({ option, ...restProps }) => {
  const setOption = useLineupsStore((store) => store.setOption);
  const options = useLineupsStore((store) => store.options);
  const value = options[option];
  const setValue = (value) => {
    setOption(option, value === "" ? undefined : value);
  };
  return <NumberField value={value} setValue={setValue} {...restProps} />;
};

const MaxLevelInput = () => (
  <LineupOptionInput
    option="maxLevel"
    label="Max Char Level"
    placeholder={`The carries - Default: ${MightMaxLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
  />
);

const MinLevelInput = () => (
  <LineupOptionInput
    option="minLevel"
    label="Min Char Level"
    placeholder={`The weakest links - Default: ${MightMinLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
  />
);

const MaxSizeInput = () => (
  <LineupOptionInput
    option="maxSize"
    label="Max Lineup Size"
    placeholder="Mob mentality - Default 12"
    min={1}
    max={20}
  />
);

const MinSizeInput = () => (
  <LineupOptionInput
    option="minSize"
    label="Min Lineup Size"
    placeholder="Who needs numbers? - Default 6"
    min={1}
    max={20}
  />
);

const MarginInput = () => (
  <LineupOptionInput
    option="margin"
    label="Tolerance"
    help="Acceptable deviation under your target score. Must be higher than the lowest might score on your roster."
    placeholder="Almost! - Default 0"
    min={0}
  />
);

const TargetScoreInput = () => (
  <LineupOptionInput
    withAsterisk
    option="targetScore"
    label="Target Might Score"
    help="The required score for the instance & difficulty you're trying to hit."
    placeholder="How mighty do you need to be?"
    type="number"
    min={0}
  />
);

export const LineupsControls = () => {
  return (
    <Stack gap="xs">
      <TargetScoreInput />
      <MarginInput />
      <MinLevelInput />
      <MaxLevelInput />
      <MinSizeInput />
      <MaxSizeInput />
    </Stack>
  );
};
