import * as z from "zod";
import { charSchema } from "./char";

export const rosterSchema = z.array(charSchema).refine(
  (chars) => {
    const names = chars.map((c) => c.name.toLowerCase());
    return names.length === new Set(names).size;
  },
  {
    message: "Each roster character must have a unique name",
    path: [],
  },
);
