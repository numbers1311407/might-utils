import * as z from "zod";
import { nanoid } from "nanoid";
import { capitalize } from "@/utils";
import { MightMinLevel, MightMaxLevel } from "@/core/config/might";
import { charClassSchema } from "./char-class.js";
import { tagSchema } from "./tag.js";

const invalidLevelMessage = `Must be a might-enabled level ${MightMinLevel}-${MightMaxLevel}`;

export const charSchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  active: z.boolean().default(true),
  class: charClassSchema,
  level: z.coerce
    .number({ message: invalidLevelMessage })
    .min(MightMinLevel, { message: invalidLevelMessage })
    .max(MightMaxLevel, { message: invalidLevelMessage }),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .transform(capitalize),
  tags: z.array(tagSchema).default([]),
  warden: z.coerce.number().min(0).max(3).default(0),
});
