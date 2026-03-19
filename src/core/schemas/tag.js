import * as z from "zod";

export const tagSchema = z.string().regex(/^[\w\d-]+$/);
