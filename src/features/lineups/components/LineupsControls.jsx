import { Stack, Flex, Group } from "@mantine/core";
import { NumberField } from "@/core/components";
import { MightMaxLevel, MightMinLevel } from "@/core/config/might";
import { useLineupsStore } from "../store";

export const LineupOptionInput = ({ option, ...restProps }) => {
  const setOption = useLineupsStore((store) => store.setOption);
  const options = useLineupsStore((store) => store.options);
  const value = options[option];
  const setValue = (value) => {
    setOption(option, value === "" ? undefined : value);
  };
  return <NumberField value={value} setValue={setValue} {...restProps} />;
};

const MaxLevelInput = (props) => (
  <LineupOptionInput
    option="maxLevel"
    label="Max Char Level"
    placeholder={`The carries - Default: ${MightMaxLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MinLevelInput = (props) => (
  <LineupOptionInput
    option="minLevel"
    label="Min Char Level"
    placeholder={`The weakest links - Default: ${MightMinLevel}`}
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MaxSizeInput = (props) => (
  <LineupOptionInput
    option="maxSize"
    label="Max Lineup Size"
    placeholder="Mob mentality - Default 12"
    min={1}
    max={20}
    {...props}
  />
);

const MinSizeInput = (props) => (
  <LineupOptionInput
    option="minSize"
    label="Min Lineup Size"
    placeholder="Who needs numbers? - Default 6"
    min={1}
    max={20}
    {...props}
  />
);

const MarginInput = (props) => (
  <LineupOptionInput
    option="margin"
    label="Tolerance"
    help="Acceptable deviation under your target score. Must be higher than the lowest might score on your roster."
    placeholder="Almost! - Default 0"
    min={0}
    step={5}
    {...props}
  />
);

const TargetScoreInput = (props) => (
  <LineupOptionInput
    withAsterisk
    option="targetScore"
    label="Target Might Score"
    help="The required score for the instance & difficulty you're trying to hit."
    placeholder="How mighty do you need to be?"
    type="number"
    min={0}
    step={10}
    {...props}
  />
);

export const LineupsControls = () => {
  return (
    <Stack gap="xs">
      <Flex gap="xs" wrap={{ base: "wrap", sm: "nowrap" }}>
        <TargetScoreInput flex="1 0 50%" />
        <MarginInput flex="1 0 50%" />
      </Flex>
      <Flex gap="xs" wrap={{ base: "wrap", sm: "nowrap" }}>
        <MinLevelInput flex="1 0 50%" />
        <MaxLevelInput flex="1 0 50%" />
      </Flex>
      <Flex gap="xs" wrap={{ base: "wrap", sm: "nowrap" }}>
        <MinSizeInput flex="1 0 50%" />
        <MaxSizeInput flex="1 0 50%" />
      </Flex>
    </Stack>
  );
};
