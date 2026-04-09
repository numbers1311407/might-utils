import * as z from "zod";
import { MightMaxLevel, MightMinLevel } from "@/core/config";

const levelSchema = z.coerce
  .number()
  .min(MightMinLevel, {
    message: `Must be higher than min might level (${MightMinLevel})`,
  })
  .max(MightMaxLevel, {
    message: `Must be lower than max might level (${MightMaxLevel})`,
  });

const sizeSchema = z.coerce
  .number()
  .min(1, { message: `Must be larger than 0` })
  .max(20, { message: `Must be smaller than 20` });

export const finderOptionsSchema = z
  .object({
    targetScore: z.coerce.number().min(0),
    minLevel: levelSchema,
    maxLevel: levelSchema,
    minSize: sizeSchema,
    maxSize: sizeSchema,
    margin: z.coerce.number(),
    distinctGroupingTags: z.coerce.boolean(),
  })
  .refine(
    (o) => {
      return (
        o.maxSize === undefined ||
        o.minSize === undefined ||
        o.maxSize >= o.minSize
      );
    },
    {
      message: "Max group size must be min group size or larger",
    },
  );
