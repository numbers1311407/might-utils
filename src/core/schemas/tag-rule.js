import { nanoid } from "nanoid";
import * as z from "zod";
import { tagSchema } from "./tag.js";
import { charClassSchema, charNameSchema, charLevelSchema } from "./char.js";

export const tagRuleRangeRegex = /^(\*)$|^(\d+)([+-])?$|^(\d+)-(\d+)$/;

const ALL = "*";
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

export const parseTagRuleRange = (range) => {
  const match = range.replace(/\s/g, "").match(tagRuleRangeRegex);

  if (!match) {
    throw new Error(`Invalid constraint format: "${range}"`);
  }

  const [_full, all, singleInt, modifier, rangeMin, rangeMax] = match;

  if (all) return all;

  if (rangeMin && rangeMax) {
    const min = parseInt(rangeMin, 10);
    const max = parseInt(rangeMax, 10);
    if (min > max) throw new Error("Range min cannot be greater than max");
    return [min, max];
  }

  const val = parseInt(singleInt, 10);
  if (modifier === "+") return [val];
  if (modifier === "-") return [0, val];

  // if we've gotten here it's an exact match
  return [val, val];
};

const sizeBound = z.number().min(1).max(20);
const size = z
  .tuple([sizeBound, sizeBound])
  .default([sizeBound.minValue, sizeBound.maxValue])
  .refine(([a, b]) => b >= a, {
    message: "Upper bound must be equal or higher to lower bound",
  });

const base = z.object({
  id: z.nanoid().default(() => nanoid()),
  size,
  warden: z.enum(["Any", "0", "1", "1+", "2", "3"]).default("Any"),
  range: z
    .string()
    .regex(tagRuleRangeRegex, {
      message:
        'E.g. "*": all, "2": exactly 2, "3+": 3 or more, "2-": 2 or less, "2-3": 2 to 3',
    })
    .meta({ flag: "invalid_range" })
    .default("1+"),
});

const variance = z.discriminatedUnion("type", [
  z.object({ type: z.literal("name"), value: charNameSchema }),
  z.object({ type: z.literal("level"), value: charLevelSchema }),
  z.object({ type: z.literal("class"), value: charClassSchema }),
  z.object({ type: z.literal("tag"), value: tagSchema }),
  z.object({ type: z.literal("warden"), value: z.literal("warden") }),
]);

export const tagRuleSchema = base.and(variance).superRefine((data, ctx) => {
  if (data.type === "warden" && data.warden === WARDEN_ANY_OPTION) {
    ctx.addIssue({
      code: "custom",
      path: ["warden"],
      message: "Warden type rules must set warden status",
    });
  }
});
