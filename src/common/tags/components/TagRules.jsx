import { useTagRulesStore } from "../store";

export const TagRules = () => {
  const rules = useTagRulesStore((store) => store.currentRuleSet());
  console.log({ rules });
  return "shit";
};
