import { Stack } from "@mantine/core";
import { QueryBuilder as ReactQueryBuilder } from "react-querybuilder";
import { useStructuredClone, useStableCallback } from "@/core/hooks";
import { CharSelect } from "@/core/components";
import {
  QueryBuilderMantine,
  MantineValueEditor,
} from "@react-querybuilder/mantine";
import { deepEqual } from "fast-equals";
import { FIELDS } from "@/core/party-finder";

// may be missing something but this seems to be a required workaround
// to get unsupported (yes that includes min, max, and step) props to
// underlying number inputs.
function CustomMantineEditor(props) {
  if (props.fieldData.dataType === "character") {
    return (
      <CharSelect
        emits="id"
        size="sm"
        placeholder="Select a Character"
        value={props.value}
        onChange={(name) => props.handleOnChange(name)}
        comboboxProps={{
          width: 250,
          position: "top-end",
        }}
      />
    );
  }

  if (props.inputType !== "number") {
    return <MantineValueEditor {...props} />;
  }

  const { min, max, step } = props.fieldData;

  return (
    <MantineValueEditor
      {...props}
      extraProps={{
        min,
        max,
        step,
        ...props.extraProps,
      }}
    />
  );
}

const controlElements = {
  valueEditor: CustomMantineEditor,
};

const combinators = [
  { name: "and", label: "Match ALL of this group" },
  { name: "or", label: "Match ANY of this group" },
];

const EMPTY_QUERY = { combinator: "and", rules: [] };

const controlClassNames = { queryBuilder: "mqb-mantine" };

export const QueryBuilder = ({
  query: propsQuery = EMPTY_QUERY,
  onQueryChange: propsOnQueryChange,
  ...rootProps
}) => {
  const query = useStructuredClone(propsQuery);
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
          controlElements={controlElements}
        />
      </QueryBuilderMantine>
    </Stack>
  );
};
