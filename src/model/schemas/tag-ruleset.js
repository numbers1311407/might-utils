import * as z from "zod";
import { nanoid } from "nanoid";
import { tagRuleSchema } from "./tag-rule.js";

export const sortTagRulesetRules = (rules) => {
  return [...rules].sort(({ size: a }, { size: b }) =>
    a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1],
  );
};

export const tagRulesetSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be present.",
    })
    .max(30, {
      message: "Name must be 30 chars or less",
    }),
  id: z.union([
    z.nanoid().default(() => nanoid()),
    z.enum(["standard-rules", "time-flagged"]),
  ]),
  // NOTE there's room in place for different rule types that could be used
  // to categorize parties for something other than filtering, for example one
  // idea was group-level tagging which could add color to group results without
  // filtering, e.g. designating a group as a "pet group" or "port capable"
  type: z.enum(["filters"]).default("filters"),
  rules: z.array(tagRuleSchema).default([]).transform(sortTagRulesetRules),
});
