import * as z from "zod";
import { nanoid } from "nanoid";
import { charSchema } from "./char.js";

export const lineupSchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z.string().min(1, { message: "Name is required" }),
  snapshot: z.json().optional(),
  chars: z.array(charSchema).default([]),
});
