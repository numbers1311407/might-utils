import * as z from "zod";
import { nanoid } from "nanoid";
import { tagRuleSchema } from "./tag-rule.js";

/**
 * Takes a ruleset and generates an errors object indicating conflicts each
 * rule has with other IDs at each found size.
 *
 * @private
 */
export const lintTagRuleset = (ruleset) => {
  const sizes = {};
  const errors = {};
  const key = (rule) => [rule.type, rule.value, rule.warden].join(":");

  // loop over and track all the unique type/val/warden combos there are
  // for each size, tracking the ID of the originating rule
  ruleset.rules.forEach((rule) => {
    const k = key(rule);
    for (let size = rule.size[0]; size <= rule.size[1]; size++) {
      sizes[k] ||= {};
      sizes[k][size] ||= [];
      sizes[k][size].push(rule.id);
    }
  });

  // loop over the resulting object and push errors with all conflicting
  // IDs at each size for each rule, mapped by ID.
  Object.values(sizes).forEach((map) => {
    for (const size in map) {
      if (map[size].length > 1) {
        map[size].forEach((id) => {
          errors[id] ||= {};
          errors[id][size] = map[size].filter((_id) => _id !== id);
        });
      }
    }
  });

  return { ok: !Object.keys(errors).length, errors };
};

export const sortTagRulesetRules = (rules) => {
  return [...rules].sort(({ size: a }, { size: b }) =>
    a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1],
  );
};

export const tagRulesetSchema = z.object({
  name: z.string(),
  id: z.union([
    z.nanoid().default(() => nanoid()),
    z.literal("default-filters"),
  ]),
  // NOTE there's room in place for different rule types that could be used
  // to categorize lineups for something other than filtering, for example one
  // idea was group-level tagging which could add color to group results without
  // filtering, e.g. designating a group as a "pet group" or "port capable"
  type: z.enum(["filters"]).default("filters"),
  rules: z.array(tagRuleSchema).default([]).transform(sortTagRulesetRules),
});
