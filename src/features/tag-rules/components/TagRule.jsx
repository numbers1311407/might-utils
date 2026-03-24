import { Badge, Box, Flex, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useStableCallback } from "@/core/hooks";
import { TagRuleBadge } from "./TagRuleBadge.jsx";
import { WardenBadge } from "./WardenBadge.jsx";
import { capitalize, formatSortedNumbers } from "@/utils";
import css from "./TagRule.module.css";

const TagRuleTextTag = ({ value }) => `"${value}"`;
const TagRuleTextLevel = ({ value }) => `Level ${value}`;
const TagRuleTextClass = ({ value }) => `${value}`;
const TagRuleTextName = ({ value }) => `${capitalize(value)}`;
const TagRuleTextWarden = () => `Warden`;

const comps = {
  tag: TagRuleTextTag,
  level: TagRuleTextLevel,
  class: TagRuleTextClass,
  name: TagRuleTextName,
  warden: TagRuleTextWarden,
  default: TagRuleTextTag,
};

const TagRuleText = ({ rule }) => {
  const Component = comps[rule.type] || comps.default;
  return <Component value={rule.value} />;
};

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

export const TagRule = ({
  conflicts,
  rule,
  onClick: propsOnClick,
  ...props
}) => {
  const onClick = useStableCallback((e) => {
    e.preventDefault();
    propsOnClick?.(rule);
  });

  return (
    <UnstyledButton className={css.root} onClick={onClick} {...props}>
      <Box className={css.header}>
        <TagRuleBadge rule={rule} />
        <WardenBadge rule={rule} hideAny />
        <Box flex="1"></Box>
        <ConflictedAlert conflicts={conflicts} />
      </Box>
      <Flex width="100%" className={css.body}>
        <Text title={rule.value} className={css.value}>
          <TagRuleText rule={rule} />
        </Text>
        <Text title="Required rule count" className={css.count}>
          {rule.range}
        </Text>
      </Flex>
    </UnstyledButton>
  );
};
