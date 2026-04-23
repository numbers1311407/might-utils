import { forwardRef } from "react";
import { Kbd, Group, Text, Tooltip } from "@mantine/core";
import { getQueryDescription } from "@/core/party-finder";

const TagRuleSizeAll = (props) => (
  <Tooltip
    withArrow
    multiline
    w={180}
    label="All characters in group must satisfy this rule"
  >
    <Group gap={8} {...props}>
      <Kbd size="lg">All</Kbd>
    </Group>
  </Tooltip>
);

const getRangeRuleText = (min, max) => {
  return max === undefined
    ? `>= ${min}`
    : min === 0
      ? `<= ${max}`
      : min === max
        ? `= ${min}`
        : `${min} - ${max}`;
};

const getRangeRuleTooltip = (min, max) => {
  const s = (val) => (val !== 1 ? "s" : "");
  return max === undefined
    ? `At least ${min} character${s(min)} must satisfy this rule`
    : min === 0
      ? `At most ${max} character${s(min)} must satisfy this rule`
      : min === max
        ? `Exactly ${min} character${s(min)} must satisfy this rule`
        : `Beteen ${min} and ${max} characters must satisfy this rule`;
};

const TagRuleSizeRange = ({ rule, ...props }) => (
  <Tooltip
    withArrow
    multiline
    w={180}
    label={getRangeRuleTooltip(...rule.value)}
  >
    <Group gap={8} {...props}>
      <Kbd size="lg">{getRangeRuleText(...rule.value)}</Kbd>
    </Group>
  </Tooltip>
);

const comps = {
  all: TagRuleSizeAll,
  range: TagRuleSizeRange,
};

const TagRuleSize = forwardRef(({ rule }, ref) => {
  const Component = comps[rule.type];
  return <Component ref={ref} rule={rule} />;
});

const TagRuleDescription = ({ rule, ...props }) => (
  <Text size="md" {...props}>
    {getQueryDescription(rule.query)}
  </Text>
);

export const TagRule = ({ rule, ...props }) => {
  return (
    <Group {...props} gap={8} align="center">
      <TagRuleSize rule={rule} />
      <TagRuleDescription rule={rule} size="md" />
    </Group>
  );
};
