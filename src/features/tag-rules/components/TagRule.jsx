import { forwardRef } from "react";
import { Kbd, Group, Text, Tooltip } from "@mantine/core";
import { formatQuery } from "react-querybuilder";
import { capitalize } from "@/utils";

const TagRuleContentAll = (props) => (
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

export const getQueryDescription = (query) => {
  const value = formatQuery(query, {
    format: "natural_language",
    translations: {
      groupSuffix: "",
      groupSuffix_not: "",
    },
    fields: [{ value: "warden", label: "warden rank" }],
    parseNumbers: true,
    valueProcessor: (rule) => {
      if (rule.field === "class") {
        return rule.value.toUpperCase();
      }
      if (rule.field === "tags") {
        return `"${rule.value}"`;
      }
      // if (rule.field === "warden" && rule.value == 0) {
      //   return "unwardened";
      // }
      return rule.value;
    },
    operatorMap: {
      ">=": "is at least",
      "<=": "is at most",
    },
  });

  return value === "1 is 1"
    ? "No rules are applied, check your query."
    : capitalize(value);
};

export const TagRule = ({ rule, ...props }) => {
  return (
    <Group {...props} gap={8} align="center">
      <TagRuleContent rule={rule} />
      <Text size="md">{getQueryDescription(rule.query)}</Text>
    </Group>
  );
};
