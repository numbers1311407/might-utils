import * as z from "zod";
import { tagRuleSchema } from "./tag-rule.js";

export const tagRuleSetSchema = z
  .map(z.number().int(), z.array(tagRuleSchema))
  .superRefine((map, ctx) => {
    for (const [key, rules] of map.entries()) {
      const seen = new Set();
      rules.forEach((rule, i) => {
        // Validate that each child is in the right size bucket
        if (rule.size !== key) {
          ctx.addIssue({
            code: "custom",
            message: `Rule idx ${i} has incorrect size ${rule.size}, should be ${key}`,
            path: [key, i, "size"],
          });
        }
        // validate that no two rules in the set have the same type & value
        const id = `${rule.type}:${rule.value}`;
        if (seen.has(id)) {
          ctx.addIssue({
            code: "custom",
            message: `Rule idx ${i} has duplicate type/value with ${rule.type}/${rule.value}`,
            path: [key, i],
          });
        } else {
          seen.add(id);
        }
      });
    }
  });
