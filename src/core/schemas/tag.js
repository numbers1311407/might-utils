import * as z from "zod";

export const tagSchema = z
  .string()
  .regex(/^[\w\d-]+$/, {
    message: "Tags can only include letters, numbers, and hyphens",
  })
  .min(1, {
    message: "Tags cannot be an empty string",
  });
