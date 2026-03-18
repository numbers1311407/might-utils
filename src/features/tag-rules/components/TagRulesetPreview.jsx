import { useMemo } from "react";
import {
  Box,
  Flex,
  List,
  Text,
  UnstyledButton,
  HoverCard,
} from "@mantine/core";
import { getNumberedArray } from "@/utils";
import { prepareTagRules, humanizeTag } from "@/core/tags";

const humanizeRange = (r) => {
  if (r.length === 1) return `${r[0]} or more`;
  if (r[0] === r[1]) return `Exactly ${r[0]}`;
  if (r[0] === 0) return `${r[1]} or less`;
  return `${r.join("-")}`;
};

const RulesList = ({ rules }) => {
  const items = !rules ? (
    <List.Item>No rules at this size</List.Item>
  ) : (
    Object.entries(rules).map(([tag, range]) => (
      <List.Item key={tag}>
        {humanizeRange(range)} {humanizeTag(tag, true)}
      </List.Item>
    ))
  );
  return <List size="sm">{items}</List>;
};

export const TagRulesetPreview = ({ ruleset }) => {
  const preparedRules = useMemo(() => {
    return ruleset ? prepareTagRules(ruleset.rules) : null;
  }, [ruleset]);

  if (!ruleset) {
    return null;
  }

  return (
    <Box>
      <Text>Hover these links for per-size summaries</Text>
      <Flex mx={-6}>
        <HoverCard.Group openDelay={200}>
          {getNumberedArray(1, 20).map((size) => (
            <HoverCard width={270} shadow="md" key={size}>
              <HoverCard.Target>
                <UnstyledButton flex="0 0 5%" ta="center">
                  <Text td={preparedRules[size] && "underline"} size="sm">
                    {size}
                  </Text>
                </UnstyledButton>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm" mb="sm">
                  A group of size {size} requires:
                </Text>
                <RulesList rules={preparedRules[size]} />
              </HoverCard.Dropdown>
            </HoverCard>
          ))}
        </HoverCard.Group>
      </Flex>
    </Box>
  );
};
