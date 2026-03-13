import * as z from "zod";

const posInt = z.number().int().min(0);

export const tagRuleSchema = z.object({
  type: z.enum(["name", "level", "class", "tag", "role"]).default("tag"),
  value: z.string(),
  warden: z.union([z.literal(true), z.number().int().min(0).max(3)]).optional(),
  range: z
    .union([
      z.enum(["*"]),
      z.number().int(),
      z.tuple([posInt]),
      z.tuple([posInt, posInt]).refine(([a, b]) => b >= a, {
        message: "Range must be [min, max]",
      }),
    ])
    .optional(),
});
