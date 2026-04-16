import { extendCharSchema } from "./char.js";

export const virtualCharSchema = extendCharSchema((schema) => {
  return schema.extend({
    class: schema.shape.class.optional(),
  });
});
