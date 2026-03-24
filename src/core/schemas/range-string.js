import * as z from "zod";

export const rangeStringRegex = /^(\*)$|^(\d+)([+-])?$|^(\d+)-(\d+)$/;

export const parseRangeString = (range) => {
  const match = range.replace(/\s/g, "").match(rangeStringRegex);

  if (!match) {
    throw new Error(`Invalid range string format: "${range}"`);
  }

  const [_, all, singleInt, modifier, rangeMin, rangeMax] = match;

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

export const rangeStringSchema = z
  .string()
  .regex(rangeStringRegex, {
    message:
      'E.g. "*": all, "2": exactly 2, "3+": 3 or more, "2-": 2 or less, "2-3": 2 to 3',
  })
  .default("1+");
