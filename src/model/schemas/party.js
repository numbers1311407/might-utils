import * as z from "zod";
import { nanoid } from "nanoid";
import { compSchema } from "./comp.js";

export const partySchema = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must be 30 characters or less" })
    .default(""),
  comp: compSchema.optional(),
});
