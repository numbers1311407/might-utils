import { nanoid } from "nanoid";
import * as z from "zod";
import { rangeStringSchema } from "./range-string.js";

const WARDEN_ANY_OPTION = "Any";

export const abbreviateTagRuleType = (type) => {
  return (
    {
      name: "NAM",
      type: "TYP",
      level: "LVL",
      class: "CLS",
      tag: "TAG",
      warden: "WRD",
    }[type] || type
  );
};

export const parseTagRuleWarden = (warden) =>
  ({
    [WARDEN_ANY_OPTION]: "",
    0: 0,
    1: 1,
    "1+": true,
    2: 2,
    3: 3,
  })[warden] ?? "";

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
  z.object({
    type: z.literal("char"),
    value: z.nanoid().min(1, "You must select a character"),
  }),
  z.object({ type: z.literal("range"), value: rangeSchema }),
  z.object({ type: z.literal("all"), value: z.literal("all") }),
]);

export const tagRuleSchema = base.and(variance);
