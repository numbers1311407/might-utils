import * as z from "zod";
import { extendPartySchema } from "./party.js";

export const virtualPartySchema = extendPartySchema((schema) =>
  schema.extend({
    dirty: z.set(z.string()),
    dirtyCount: z.number(),
    chars: z.array(z.any()),
    isDirty: z.boolean(),
  }),
);
