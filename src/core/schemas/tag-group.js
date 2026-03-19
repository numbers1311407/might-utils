import { nanoid } from "nanoid";
import * as z from "zod";

export const tagGroupSchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z.string(),
  tags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});
