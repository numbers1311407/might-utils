import * as z from "zod";
import { nanoid } from "nanoid";
import { charSchema } from "./char.js";

const sortChars = (chars) =>
  [...chars].sort((a, b) => a.name.localeCompare(b.name));

export const lineupSchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must be 30 characters or less" })
    .default(""),
  chars: z.array(charSchema).default([]).transform(sortChars),
});
