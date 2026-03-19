import { nanoid } from "nanoid";
import * as z from "zod";
import { tagSchema } from "./tag.js";

export const tagGroupSchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z.string(),
  tags: z.array(tagSchema).default([]),
  active: z.boolean().default(true),
});
