import { Flex } from "@mantine/core";
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
    placeholder="The carries"
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MinLevelInput = (props) => (
  <LineupOptionInput
    option="minLevel"
    label="Min Char Level"
    placeholder="The twinks"
    min={MightMinLevel}
    max={MightMaxLevel}
    {...props}
  />
);

const MaxSizeInput = (props) => (
  <LineupOptionInput
    option="maxSize"
    label="Max Lineup Size"
    placeholder="Big party"
    min={1}
    max={20}
    {...props}
  />
);

const MinSizeInput = (props) => (
  <LineupOptionInput
    option="minSize"
    label="Min Lineup Size"
    placeholder="Lil' party"
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
    placeholder="Close enough?"
    min={0}
    step={5}
    {...props}
  />
);

const TargetScoreInput = (props) => (
  <LineupOptionInput
    withAsterisk
    option="targetScore"
    label="Target Might"
    help="The required score for the instance & difficulty you're trying to hit."
    placeholder="How mighty?"
    type="number"
    min={0}
    step={10}
    {...props}
  />
);

export const LineupsControls = () => {
  return (
    <Flex gap="xs" wrap={{ base: "wrap", md: "nowrap" }}>
      <TargetScoreInput flex="1 1 120px" />
      <MarginInput flex="1 1 120px" />
      <MinLevelInput flex="1 1 120px" />
      <MaxLevelInput flex="1 1 120px" />
      <MinSizeInput flex="1 1 120px" />
      <MaxSizeInput flex="1 1 120px" />
    </Flex>
  );
};
