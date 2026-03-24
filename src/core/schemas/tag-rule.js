import { nanoid } from "nanoid";
import * as z from "zod";
import { tagSchema } from "./tag.js";
import { rangeStringSchema } from "./range-string.js";
import { charClassSchema, charNameSchema, charLevelSchema } from "./char.js";

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
  range: rangeStringSchema,
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
