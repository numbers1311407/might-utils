import * as z from "zod";
import { nanoid } from "nanoid";
import { compSchema, getMightFromPartyComp } from "./comp.js";

export const partySchemaBase = z.object({
  id: z.nanoid().default(() => nanoid()),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must be 30 characters or less" })
    .default(""),
  comp: compSchema.optional(),
  might: z.number().default(0),
});

const transform = (party) => {
  return {
    ...party,
    might: getMightFromPartyComp(party.comp),
  };
};

export const partySchema = partySchemaBase.transform(transform);

export const extendPartySchema = (fn) => {
  const extended = fn(partySchemaBase);
  return extended.transform(transform);
};
