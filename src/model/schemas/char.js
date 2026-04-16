import * as z from "zod";
import { MightMinLevel, MightMaxLevel } from "@/config/might";
import { getMaxWardenForLevel } from "@/config/chars/warden";
import { getCharMight } from "@/config/chars/might";
import { CLASS_SHORTNAMES } from "@/config";
import { capitalize } from "@/utils";
import { tagSchema } from "./tag.js";

export const charClassSchema = z.enum(CLASS_SHORTNAMES, {
  message: 'Expected a valid 3-letter class shortname, e.g. "WAR"',
});

export const charNameSchema = z
  .string()
  .regex(/^\w+$/, {
    message: "Name can only contain letters, numbers, and undercore.",
  })
  .min(1, {
    message: "Name is required",
  })
  .max(30, {
    message: "Name cannot be longer than 30 characters",
  })
  .transform(capitalize);

export const charActiveSchema = z.boolean().default(true);

export const charWardenSchema = z.coerce
  .number()
  .min(0, "Warden must be between 0-3")
  .max(3, "Warden must be between 0-3")
  .default(0);

const invalidLevelMessage = `Must be a might-enabled level ${MightMinLevel}-${MightMaxLevel}`;

export const charLevelSchema = z.coerce
  .number({ message: invalidLevelMessage })
  .min(MightMinLevel, { message: invalidLevelMessage })
  .max(MightMaxLevel, { message: invalidLevelMessage });

export const charSchemaBase = z.object({
  active: charActiveSchema,
  class: charClassSchema,
  level: charLevelSchema,
  name: charNameSchema,
  tags: z
    .array(tagSchema)
    .default([])
    .transform((tags) => [...tags].sort()),
  warden: charWardenSchema,
  might: z.number().min(0, "Might cannot be lower than 0").default(0),
});

export const extendCharSchema = (fn) => {
  return fn(charSchemaBase)
    .transform((char) => ({
      ...char,
      might: getCharMight(char),
    }))
    .refine((o) => o.warden <= getMaxWardenForLevel(o.level), {
      message: "Warden rank is impossible for level",
      path: ["warden"],
    });
};

export const charSchema = extendCharSchema((s) => s);
