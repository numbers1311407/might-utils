import { TagRuleTypes } from "@/model/schemas";
import { applyRule } from "./json-logic.js";

export const createPartyValidator = (rules, pool) => {
  const [validIdxsByRule, rulesBySize] = rules.reduce(
    ([validIdxsByRule, rulesBySize], rule) => {
      // Map all the rules into arrays by size. When validating a party later on
      // we'll pull the rules that apply to it by fetching the array for its size
      // from this.
      for (let size = rule.size[0]; size <= rule.size[1]; size++) {
        if (!rulesBySize.has(size)) {
          rulesBySize.set(size, []);
        }
        rulesBySize.get(size).push(rule);
      }
      // validMap will track the results of every roster slot against every test
      validIdxsByRule.set(
        // so for this rule id
        rule.id,
        // run the rule query against every slot in the pool and add the pool
        // index of those that pass to a set
        pool.reduce(
          (passingSlots, slot) =>
            applyRule(rule, slot) ? passingSlots.add(slot.idx) : passingSlots,
          new Set(),
        ),
      );
      return [validIdxsByRule, rulesBySize];
    },
    [new Map(), new Map()],
  );

  return {
    test: (partyIdxs) => {
      // get the ruleset for this party size.
      const appliedRules = rulesBySize.get(partyIdxs.size);

      // if no rules for this party size, pass
      if (!appliedRules) return true;

      // otherwise every rule must pass
      return appliedRules.every((rule) => {
        // get size of intersection between pool indexes of the party, and
        // those of slots that passed this rule
        const validIdxs = validIdxsByRule.get(rule.id);
        const validCount = validIdxs.intersection(partyIdxs).size;

        // the ALL type means every slot in the party must pass
        if (rule.type === TagRuleTypes.ALL)
          return partyIdxs.size === validCount;

        // the other type is RANGE, which is stored in value as min and
        // optional max required passes, test that
        const [min, max] = rule.value;
        return validCount >= min && (max === undefined || validCount <= max);
      });
    },
  };
};
