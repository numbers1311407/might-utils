import * as z from "zod";
import { capitalize } from "@/utils";
import { charClassSchema } from "./char-class";

export const charSchema = z.object({
  active: z.boolean().default(true),
  class: charClassSchema,
  level: z.coerce
    .number({ message: "Must be a valid level 1-71" })
    .min(1, { message: "Must be a valid level 1-71" })
    .max(71, { message: "Must be a valid level 1-71" }),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .transform(capitalize),
  tags: z.array(z.string()).default([]),
  warden: z.coerce.number().min(0).max(3).default(0),
});
