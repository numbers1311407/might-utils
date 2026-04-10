import { nanoid } from "nanoid";
import * as z from "zod";
import { tagSchema } from "./tag.js";

export const tagGroupSchema = z.object({
  id: z.union([
    z.nanoid().default(() => nanoid()),
    z.literal("defaults-roles"),
    z.literal("defaults-roles-split"),
  ]),
  name: z.string().min(1, { message: "Name is required" }),
  tags: z
    .array(tagSchema)
    .min(2, { message: "Must contain at least 2 tags" })
    .default([]),
  active: z.boolean().default(true),
});
