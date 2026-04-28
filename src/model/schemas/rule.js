import { nanoid } from "nanoid";
import * as z from "zod";

const sizeBound = z.number().min(1).max(20);

const sizeSchema = z
  .tuple([sizeBound, sizeBound])
  .default([sizeBound.minValue, sizeBound.maxValue])
  .refine(([a, b]) => b >= a, {
    message: "Upper bound must be equal or higher to lower bound",
  });

const rangeSchema = z
  .array(z.number().min(0).max(20))
  .min(1, "Contains at least 1 number: [min]")
  .max(2, "Contains at most 2 numbers: [min, max]")
  .refine(
    ([a, b]) => {
      return b === undefined || b >= a;
    },
    {
      message: "Upper bound must be equal or higher to lower bound",
      path: [1],
    },
  );

const defaultRules = [];
const defaultQuery = { combinator: "and", rules: defaultRules };
const types = Object.freeze({
  RANGE: "range",
  ALL: "all",
});

const base = z.object({
  id: z.nanoid().default(() => nanoid()),
  size: sizeSchema,
  query: z
    .object({
      id: z.string().optional(),
      not: z.boolean().optional(),
      combinator: z.enum(["and", "or"]).default("and"),
      rules: z.array(z.any()).default(defaultRules),
    })
    .default(defaultQuery),
});

const variance = z.discriminatedUnion("type", [
  z.object({ type: z.literal(types.RANGE), value: rangeSchema }),
  z.object({ type: z.literal(types.ALL), value: z.literal(types.ALL) }),
]);

export const ruleSchema = base.and(variance);
export const RuleTypes = types;
