import { Stack } from "@mantine/core";
import {
  QueryBuilder as ReactQueryBuilder,
  defaultOperators,
} from "react-querybuilder";
import { useDeepMemo, useStableCallback } from "@/core/hooks";
import {
  QueryBuilderMantine,
  MantineValueEditor,
} from "@react-querybuilder/mantine";
import { deepEqual } from "fast-equals";
import {
  charClassSchema,
  charLevelSchema,
  charWardenSchema,
  tagSchema,
} from "@/core/schemas";
import { MightMinLevel, MightMaxLevel } from "@/core/config/might";

const ops = (...names) =>
  defaultOperators.filter(({ name }) => names.includes(name));
const schemaValidator = (schema) => (r) => schema.safeParse(r.value).success;

const CustomMantineEditor = (props) => {
  if (props.inputType !== "number") {
    return <MantineValueEditor {...props} />;
  }

  // Extract your custom properties from the field definition
  const { min, max } = props.fieldData;

  // Render the official Mantine wrapper, injecting extraProps
  return (
    <MantineValueEditor
      {...props}
      extraProps={{
        min,
        max,
        ...props.extraProps,
      }}
    />
  );
};

const controlElements = {
  valueEditor: CustomMantineEditor,
};

const combinators = [
  { name: "and", label: "Match ALL of this group" },
  { name: "or", label: "Match ANY of this group" },
  // { name: "and", label: "AND" },
  // { name: "or", label: "OR" },
];

const EMPTY_QUERY = { combinator: "and", rules: [] };
const FIELDS = [
  {
    name: "level",
    label: "Level",
    inputType: "number",
    defaultValue: MightMaxLevel,
    min: MightMinLevel,
    max: MightMaxLevel,
    step: 1,
    operators: ops("=", "!=", "<", ">", "<=", ">=", "between", "not between"),
    validator: (r) => schemaValidator(charLevelSchema),
  },
  {
    name: "class",
    label: "Class",
    valueEditorType: "select",
    defaultValue: "BER",
    defaultOperator: "=",
    operators: ops("=", "!="),
    validator: (r) => schemaValidator(charClassSchema),
    values: charClassSchema.options.map((option) => ({
      label: option,
      value: option,
    })),
  },
  {
    name: "warden",
    label: "Warden",
    valueEditorType: "select",
    defaultValue: "0",
    operators: ops("=", "!=", "<", ">", "<=", ">=", "between", "not between"),
    values: [
      { label: "Unwardened", value: "0" },
      { label: "Rank 1", value: "1" },
      { label: "Rank 2", value: "2" },
      { label: "Rank 3", value: "3" },
    ],
    validator: (r) => schemaValidator(charWardenSchema),
  },
  {
    name: "tags",
    label: "Tags",
    inputType: "text",
    operators: [
      { name: "tag", label: "includes" },
      { name: "notag", label: "do not include" },
    ],
    validator: (r) => schemaValidator(tagSchema),
  },
];
const controlClassNames = { queryBuilder: "mqb-mantine" };
const operators = defaultOperators;

export const QueryBuilder = ({
  query: propsQuery = EMPTY_QUERY,
  onQueryChange: propsOnQueryChange,
  ...rootProps
}) => {
  const query = useDeepMemo(propsQuery);
  const onQueryChange = useStableCallback((changedQuery) => {
    if (
      typeof propsOnQueryChange === "function" &&
      !deepEqual(query, changedQuery)
    ) {
      propsOnQueryChange(changedQuery);
    }
  });

  return (
    <Stack gap="md" {...rootProps}>
      <QueryBuilderMantine>
        <ReactQueryBuilder
          fields={FIELDS}
          onQueryChange={onQueryChange}
          // note defaultQuery to disable controlled behavior which
          // has proven problematic (slow, loss of focus)
          defaultQuery={query}
          combinators={combinators}
          controlClassnames={controlClassNames}
          operators={operators}
          controlElements={controlElements}
        />
      </QueryBuilderMantine>
    </Stack>
  );
};
