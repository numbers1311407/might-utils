import { NumberField } from "@/common/components";
import { MightMaxLevel, MightMinLevel } from "@/common/might";
import { useLineupsStore } from "../store.js";

export const LineupOptionInput = ({ option, ...restProps }) => {
  const setOption = useLineupsStore((store) => store.setOption);
  const options = useLineupsStore((store) => store.options);
  const value = options[option];
  const setValue = (value) => setOption(option, value);

  return <NumberField value={value} setValue={setValue} {...restProps} />;
};

const MaxLevelInput = () => (
  <LineupOptionInput
    option="maxLevel"
    label="Max Char Level"
    placeholder={`Highest allowed char level, default ${MightMinLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
  />
);

const MinLevelInput = () => (
  <LineupOptionInput
    option="minLevel"
    label="Min Char Level"
    placeholder={`Lowest allowed char level, default ${MightMinLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
  />
);

const MaxSizeInput = () => (
  <LineupOptionInput
    option="maxSize"
    label="Max Lineup Size"
    placeholder="Max desired size of lineup, default 12"
    min={1}
    max={20}
  />
);

const MinSizeInput = () => (
  <LineupOptionInput
    option="minSize"
    label="Min Lineup Size"
    placeholder="Min lineup size, default 6"
    min={1}
    max={20}
  />
);

const MarginInput = () => (
  <LineupOptionInput
    option="margin"
    label="Margin"
    placeholder="Allowance under target score, default 0"
    min={0}
  />
);

const TargetScoreInput = () => (
  <LineupOptionInput
    option="targetScore"
    label="Target Might Score"
    placeholder="The score you need your team to hit"
    type="number"
    min={0}
  />
);

export const LineupsControls = () => {
  return (
    <>
      <TargetScoreInput />
      <MarginInput />
      <MinLevelInput />
      <MaxLevelInput />
      <MinSizeInput />
      <MaxSizeInput />
    </>
  );
};
