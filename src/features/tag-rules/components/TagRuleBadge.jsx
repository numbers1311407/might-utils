import { Badge } from "@mantine/core";
import { abbreviateTagRuleType } from "@/core/schemas";

const colors = {
  name: "blue",
  tag: "orange",
  class: "pink",
  level: "green",
  warden: "purple",
};

export const TagRuleBadge = ({ rule, ...props }) => {
  return (
    <Badge
      color={colors[rule.type]}
      title={`Rule Type: ${rule.type}`}
      ff="mono"
      {...props}
    >
      {abbreviateTagRuleType(rule.type)}
    </Badge>
  );
};
