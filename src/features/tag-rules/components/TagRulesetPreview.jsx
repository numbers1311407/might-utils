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

const RulesList = ({ rules, Item = List.Item, ...listProps }) => {
  const items = !rules ? (
    <Item>No rules at this size</Item>
  ) : (
    Object.entries(rules).map(([tag, range]) => (
      <Item key={tag}>
        {humanizeRange(range)} {humanizeTag(tag, true)}
      </Item>
    ))
  );
  return (
    <List size="sm" {...listProps}>
      {items}
    </List>
  );
};

export const TagRulesetPreview = ({ ruleset, ...props }) => {
  const preparedRules = useMemo(() => {
    return ruleset ? prepareTagRules(ruleset.rules) : null;
  }, [ruleset]);

  if (!ruleset) {
    return null;
  }

  return (
    <Box {...props}>
      <Flex mx={-2} my={0}>
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
                  A party of size {size} requires:
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

TagRulesetPreview.RulesList = RulesList;
