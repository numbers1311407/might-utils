import * as z from "zod";
import { nanoid } from "nanoid";
import { tagRuleSchema } from "./tag-rule.js";

export const tagRulesetSchema = z.object({
  name: z.string(),
  id: z.union([
    z.nanoid().default(() => nanoid()),
    z.literal("default-filters"),
  ]),
  // NOTE the reason tag rules has two types is to eventually accommodate rules used
  // to filter as well as rules used to classify, the idea being you can define rules
  // to express tags that assign classifications to lineups, like "pet group" for a
  // group with n+ pet classes or "can port" for groups that have 1+ porter for every
  // 6 characters. These classifications would be displayed on lineups results and
  // incorporated into group tags.
  type: z.enum(["filters"]).default("filters"),
  rules: z
    .record(z.number().int(), z.array(tagRuleSchema))
    .superRefine((map, ctx) => {
      for (const [key, rules] of Object.entries(map)) {
        const seen = new Set();
        rules.forEach((rule, i) => {
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
    }),
});
