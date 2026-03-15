import { nanoid } from "nanoid";
import * as z from "zod";

export const tagRuleRangeRegex = /^(\*)$|^(\d+)([+-])?$|^(\d+)-(\d+)$/;

const ALL = "*";

export const parseTagRuleWarden = (warden) =>
  ({
    Any: "",
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

export const tagRuleSchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  type: z.enum(["name", "level", "class", "tag", "role"]).default("tag"),
  value: z.string(),
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
