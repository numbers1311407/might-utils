import { Table } from "@mantine/core";
import { useTagRulesStore } from "../store";

const head = ["Size", "Type", "Value", "Range", "Warden"];

export const TagRules = () => {
  const ruleSet = useTagRulesStore((store) => store.currentRuleSet());

  const body = Array.from(ruleSet).reduce((acc, [size, rules]) => {
    return acc.concat(
      rules.map((rule) => [
        rule === rules[0] ? size : "",
        rule.type,
        rule.value,
        Array.isArray(rule.range)
          ? rule.range.length === 2
            ? rule.range.join(" to ")
            : `${rule.range}+`
          : rule.range === "*"
            ? "all"
            : `${rule.range ?? "-"}`,
        rule.warden || "-",
      ]),
    );
  }, []);

  return <Table data={{ head, body }} />;
};
