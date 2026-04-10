import * as z from "zod";
import { nanoid } from "nanoid";
import { charSchema } from "./char.js";

const sortChars = (chars) =>
  [...chars].sort((a, b) => a.name.localeCompare(b.name));

// Saved party member tags are inherited and not editable. they're invisible
// to the UI but we'll strip them here to keep the store clean and make that
// a little more apparent.
const stripTags = (chars) => chars.map((char) => ({ ...char, tags: [] }));

export const partySchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must be 30 characters or less" })
    .default(""),
  chars: z
    .array(charSchema)
    .default([])
    .transform(sortChars)
    .transform(stripTags),
  snapshot: z.array(charSchema).default([]),
});
