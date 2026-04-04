import { forwardRef } from "react";
import {
  Badge,
  Box,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { formatQuery } from "react-querybuilder";
import { ClassIcon } from "@/core/components";
import { useStableCallback } from "@/core/hooks";
import { formatSortedNumbers } from "@/utils";
import { useRosterChar } from "@/core/store";

const TagRuleContentAll = ({ rule, ...props }) => {
  return <Text {...props}>Everyone must pass</Text>;
};
const TagRuleContentChar = ({ rule, ...props }) => {
  const char = useRosterChar(rule.value);
  return (
    <Group gap={8}>
      <ClassIcon {...props} size={32} cls={char.class} />
      <Text>{char.name} must pass</Text>
    </Group>
  );
};
const TagRuleContentRange = ({ rule, ...props }) => {
  const [min, max] = rule.value;
  const ruleText =
    max === undefined
      ? `At least ${min}`
      : min === 0
        ? `At most ${max}`
        : min === max
          ? `Exactly ${min}`
          : `${min} to ${max}`;

  return <Text {...props}>{ruleText} must pass</Text>;
};

const comps = {
  all: TagRuleContentAll,
  char: TagRuleContentChar,
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
    format: "SQL",
    fields: true,
  });
  return value === "(1 = 1)" ? "No rules are applied" : value;
};

export const TagRule = ({ conflicts, rule, ...props }) => {
  return (
    <Group {...props} gap={8}>
      <ConflictedAlert conflicts={conflicts} />
      <TagRuleContent rule={rule} />:
      <Text>{getQueryDescription(rule.query)}</Text>
    </Group>
  );
};
