import { useCallback } from "react";
import { MightMaxLevel, MightMinLevel } from "@/common/might";
import { Input, NumberInput } from "@mantine/core";
import { useLineupsSettingStore } from "../hooks.js";

export const LineupControlsInput = ({
  defaultValue,
  label,
  setting,
  ...restProps
}) => {
  const [value, setValue, persistValue] = useLineupsSettingStore(setting);
  const min = restProps.min;
  const max = restProps.max;

  const commitValue = useCallback(
    ({ target }) => {
      if (isNaN(target.value)) {
        persistValue(defaultValue);
      } else {
        let value = Number(target.value);
        if (min !== undefined && value < min) {
          value = min;
        }
        if (max !== undefined && value > max) {
          value = max;
        }
        persistValue(value);
      }
    },
    [defaultValue, persistValue, min, max],
  );

  const blurOnEnter = useCallback(({ key, target }) => {
    if (key === "Enter") target.blur();
  }, []);

  return (
    <Input.Wrapper label={label}>
      <NumberInput
        allowNegative={false}
        value={value}
        onChange={setValue}
        onKeyDown={blurOnEnter}
        onBlur={commitValue}
        {...restProps}
      />
    </Input.Wrapper>
  );
};

const MaxLevelInput = () => (
  <LineupControlsInput
    setting="maxLevel"
    label="Max Char Level"
    placeholder={`Highest allowed char level, default ${MightMinLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
    defaultValue={MightMaxLevel}
  />
);

const MinLevelInput = () => (
  <LineupControlsInput
    setting="minLevel"
    label="Min Char Level"
    placeholder={`Lowest allowed char level, default ${MightMinLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
    defaultValue={MightMinLevel}
  />
);

const MaxSizeInput = () => (
  <LineupControlsInput
    setting="maxSize"
    label="Max Lineup Size"
    placeholder="Max desired size of lineup, default 12"
    min={1}
    max={20}
    defaultValue={12}
  />
);

const MinSizeInput = () => (
  <LineupControlsInput
    setting="minSize"
    label="Min Lineup Size"
    placeholder="Min lineup size, default 6"
    min={1}
    max={20}
    defaultValue={6}
  />
);

const MarginInput = () => (
  <LineupControlsInput
    setting="margin"
    label="Margin"
    placeholder="Allowance under target score, default 0"
    min={0}
    defaultValue={0}
  />
);

const TargetScoreInput = () => (
  <LineupControlsInput
    setting="targetScore"
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
