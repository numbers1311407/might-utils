import { useId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import {
  Group,
  Stack,
  InputLabel,
  Text,
  CheckboxGroupContext,
  UnstyledButton,
} from "@mantine/core";
import { useStableCallback } from "@/core/hooks";
import {
  CheckButton,
  CheckboxCell,
  Table,
  Th,
  Tr,
  Td,
  Tbody,
  Tfoot,
  Thead,
} from "./common.jsx";

// This seems like mantine private API but I'm not sure there's another way to
// use the context given their shipped component add structure, and here we just
// want to wrap a <tr> in the middle of a table.
const CheckboxContext = ({
  children,
  name,
  onChange: _onChange,
  size,
  value: _value,
}) => {
  const id = useId();
  const onChange = useStableCallback((event) => {
    _onChange?.(event);
  });
  const value = {
    value: _value,
    size,
    onChange,
    name: name || id,
  };
  return <CheckboxGroupContext value={value}>{children}</CheckboxGroupContext>;
};

export const UnlockedTableForm = ({
  party,
  exclude,
  map,
  addFields,
  toggleField,
  removeFields,
  hasTags = false,
}) => {
  return (
    <Stack gap={0}>
      <InputLabel>Per-Member Rules</InputLabel>
      <Text size="xs" c="dark" mb={3}>
        Select of the properties of the party members as rules. These will form
        the baseline for a simple ruleset which you can further modify in the
        rules UI.
      </Text>
      <Table withTableBorder>
        <Thead>
          <Tr>
            <Th>
              <CheckButton
                onClick={() => toggleField("*", "name")}
                label="Name"
              />
            </Th>
            <Th borderLeft>
              <CheckButton
                onClick={() => toggleField("*", "level")}
                label="Level"
              />
            </Th>
            <Th>
              <CheckButton
                onClick={() => toggleField("*", "warden")}
                label="Warden"
              />
            </Th>
            <Th>
              <CheckButton
                onClick={() => toggleField("*", "class")}
                label="Class"
              />
            </Th>
            <Th>
              <CheckButton
                disabled={!hasTags}
                onClick={hasTags ? () => toggleField("*", "tags") : undefined}
                label="Tags"
              />
            </Th>
            <Th borderLeft borderRight width={70}>
              Exclude
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {party.map((slot) => (
            <CheckboxContext
              onChange={(e) => {
                const { value: field, checked } = e.target;
                if (checked) {
                  addFields(slot.name, field);
                } else {
                  removeFields(slot.name, field);
                }
              }}
              value={map.get(slot.name) || []}
              key={slot.name}
            >
              <Row exclude={exclude} slot={slot} hasTags={hasTags} />
            </CheckboxContext>
          ))}
        </Tbody>
      </Table>
    </Stack>
  );
};

const Row = ({ slot, hasTags, exclude }) => (
  <Tr>
    <CheckboxCell value="name" slot={slot} label={slot.name} />
    <CheckboxCell value="level" slot={slot} label={slot.level} />
    <CheckboxCell
      value="warden"
      slot={slot}
      label={slot.warden ? `Rk. ${slot.warden}` : "No"}
    />
    <CheckboxCell value="class" slot={slot} label={slot.class} />
    <CheckboxCell
      value="tags"
      slot={slot}
      notApplicable={!hasTags}
      label={slot.tags.join("+")}
    />
    <Td p={0} borderLeft>
      <UnstyledButton
        component={Group}
        onClick={() => exclude(slot.name)}
        justify="center"
      >
        <IconTrash size={24} />
      </UnstyledButton>
    </Td>
  </Tr>
);
