import * as z from "zod";
import { capitalize } from "@/utils";
import { charClassSchema } from "./char-class";
import { MightMinLevel, MightMaxLevel } from "@/common/might";

const invalidLevelMessage = `Must be a might-enabled level ${MightMinLevel}-${MightMaxLevel}`

export const charSchema = z.object({
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
  tags: z.array(z.string()).default([]),
  warden: z.coerce.number().min(0).max(3).default(0),
});
