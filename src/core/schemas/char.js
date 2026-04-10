import * as z from "zod";
import { nanoid } from "nanoid";
import { MightMinLevel, MightMaxLevel } from "@/core/config/might";
import { getMaxWardenForLevel } from "@/core/chars/warden";
import { capitalize } from "@/utils";
import { tagSchema } from "./tag.js";
import { CLASS_SHORTNAMES } from "@/core/config";

export const charClassSchema = z.enum(CLASS_SHORTNAMES, {
  message: 'Expected a 3-letter class shortname, e.g. "WAR"',
});

export const charNameSchema = z
  .string()
  .regex(/^\w+$/, {
    message: "Name can only contain letters",
  })
  .min(1, {
    message: "Name is required",
  })
  .max(30, {
    message: "Name cannot be longer than 30 characters",
  })
  .transform(capitalize);

const invalidLevelMessage = `Must be a might-enabled level ${MightMinLevel}-${MightMaxLevel}`;
export const charActiveSchema = z.boolean().default(true);

export const charWardenSchema = z.coerce.number().min(0).max(3).default(0);

export const charLevelSchema = z.coerce
  .number({ message: invalidLevelMessage })
  .min(MightMinLevel, { message: invalidLevelMessage })
  .max(MightMaxLevel, { message: invalidLevelMessage });

export const charSchema = z
  .object({
    id: z.nanoid().default(() => nanoid()),
    active: charActiveSchema,
    class: charClassSchema,
    level: charLevelSchema,
    name: charNameSchema,
    tags: z
      .array(tagSchema)
      .default([])
      .transform((tags) => [...tags].sort()),
    warden: charWardenSchema,
  })
  .refine((o) => o.warden <= getMaxWardenForLevel(o.level), {
    message: "Warden rank is impossible for level",
    path: ["warden"],
  });
