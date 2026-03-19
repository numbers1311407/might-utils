import { nanoid } from "nanoid";
import * as z from "zod";
import { tagSchema } from "./tag.js";

export const tagGroupSchema = z.object({
  id: z.union([
    z.nanoid().default(() => nanoid()),
    z.literal("defaults-roles"),
    z.literal("defaults-roles-split"),
  ]),
  name: z.string(),
  tags: z.array(tagSchema).default([]),
  active: z.boolean().default(true),
});
