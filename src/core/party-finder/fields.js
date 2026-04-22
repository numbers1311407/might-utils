import { defaultOperators } from "react-querybuilder";

import {
  charClassSchema,
  charLevelSchema,
  charWardenSchema,
  tagSchema,
} from "@/model/schemas";
import { MightMinLevel, MightMaxLevel } from "@/config/might";

const schemaValidator = (schema) => (r) => schema.safeParse(r.value).success;

const ops = (...names) =>
  defaultOperators.filter(({ name }) => names.includes(name));

export const FIELDS = [
  {
    name: "tags",
    label: "Tags",
    inputType: "text",
    operators: ops("contains", "doesNotContain"),
    validator: schemaValidator(tagSchema),
  },
  {
    name: "warden",
    label: "Warden",
    valueEditorType: "select",
    defaultValue: "0",
    operators: ops("=", "!=", "<", ">", "<=", ">=", "between", "notBetween"),
    values: [
      { label: "Unwardened", value: "0" },
      { label: "Rank 1", value: "1" },
      { label: "Rank 2", value: "2" },
      { label: "Rank 3", value: "3" },
    ],
    validator: schemaValidator(charWardenSchema),
  },
  {
    name: "level",
    label: "Level",
    inputType: "number",
    defaultValue: MightMaxLevel,
    min: MightMinLevel,
    max: MightMaxLevel,
    step: 1,
    operators: ops("=", "!=", "<", ">", "<=", ">=", "between", "notBetween"),
    validator: schemaValidator(charLevelSchema),
  },
  {
    name: "name",
    label: "Name",
    defaultValue: "",
    dataType: "character",
    operators: ops("=", "!="),
  },
  {
    name: "class",
    label: "Class",
    valueEditorType: "select",
    defaultValue: "BER",
    defaultOperator: "=",
    operators: ops("=", "!="),
    validator: schemaValidator(charClassSchema),
    values: charClassSchema.options.map((option) => ({
      label: option,
      value: option,
    })),
  },
];
