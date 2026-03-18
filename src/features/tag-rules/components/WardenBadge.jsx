import { Badge } from "@mantine/core";
import css from "./WardenBadge.module.css";

const wardenClass = (rule) => {
  const suffix =
    {
      0: "-0",
      "1+": "-active",
      1: "-1",
      2: "-2",
      3: "-3",
    }[rule.warden] || "-any";
  return css[`warden-rank${suffix}`];
};

export const WardenBadge = ({ rule, hideAny, ...props }) => {
  if (hideAny && rule.warden === "Any") {
    return null;
  }
  return (
    <Badge
      className={[css.root, wardenClass(rule)]}
      title={`Warden: ${rule.warden}`}
      {...props}
    >
      W-{rule.warden}
    </Badge>
  );
};
