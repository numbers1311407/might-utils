import * as z from "zod";

const posInt = z.number().int().min(0);

export const tagRuleSchema = z.object({
  type: z.enum(["name", "level", "class", "tag", "role"]).default("tag"),
  value: z.string(),
  warden: z.union([
    z.coerce.boolean(true),
    z.coerce.number().int().min(-1).max(3),
  ]),
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
