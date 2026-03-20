import * as z from "zod";
import { charSchema } from "./char.js";

export const lineupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  snapshot: z.json().optional(),
  chars: z.array(charSchema).default([]),
});
