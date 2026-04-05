import { forwardRef } from "react";
import { Badge, Kbd, Group, Text, Tooltip } from "@mantine/core";
import { formatQuery } from "react-querybuilder";
import { formatSortedNumbers } from "@/utils";

const TagRuleContentAll = ({ rule, ...props }) => (
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

const TagRuleContentRange = ({ rule, ...props }) => (
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
  all: TagRuleContentAll,
  range: TagRuleContentRange,
};

const TagRuleContent = forwardRef(({ rule }, ref) => {
  const Component = comps[rule.type];
  return <Component ref={ref} rule={rule} />;
});

const ConflictedAlert = ({ conflicts }) => {
  if (!conflicts) {
    return null;
  }

  const sizes = Object.keys(conflicts).map(Number);
  const label = `This rule has conflicts at size(s): ${formatSortedNumbers(sizes)}`;

  return (
    <Tooltip label={label}>
      <Badge circle color="var(--mantine-color-error)">
        !
      </Badge>
    </Tooltip>
  );
};

export const getQueryDescription = (query) => {
  const value = formatQuery(query, {
    format: "natural_language",
    translations: {
      groupSuffix: "",
      groupSuffix_not: "",
    },
    fields: [{ value: "warden", label: "warden rank" }],
    parseNumbers: true,
    operatorMap: {
      ">=": "is at least",
      "<=": "is at most",
    },
  });
  return value === "1 is 1"
    ? "No rules are applied (might want to check your query)"
    : `Character ${value}`;
};

export const TagRule = ({ conflicts, rule, ...props }) => {
  return (
    <Group {...props} gap={8} align="center">
      <ConflictedAlert conflicts={conflicts} />
      <TagRuleContent rule={rule} />
      <Text size="md">{getQueryDescription(rule.query)}</Text>
    </Group>
  );
};
