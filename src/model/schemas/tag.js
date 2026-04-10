import * as z from "zod";

export const tagSchema = z
  .string()
  .min(1, {
    message: "Tags cannot be an empty string",
  })
  .regex(/^[\w\d-]+$/, {
    message: "Tags can only include letters, numbers, and hyphens",
  });
