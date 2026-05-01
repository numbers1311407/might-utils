import { useCallback } from "react";
import { useId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import {
  Group,
  InputLabel,
  RadioGroupContext,
  Stack,
  Text,
} from "@mantine/core";
import { useStableCallback } from "@/core/hooks";
import {
  CheckButton,
  RadioCell,
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
const RadioContext = ({
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
  return <RadioGroupContext value={value}>{children}</RadioGroupContext>;
};

const FIELDS_MAP = {
  name: ["level", "warden", "name"],
  tags: ["level", "warden", "tags"],
  slot: ["level", "warden"],
  exclude: [],
};

export const LockedTableForm = ({
  party,
  data,
  setFields,
  hasTags = false,
  totalMight,
}) => {
  const set = useCallback(
    (name, type) => {
      setFields(name, FIELDS_MAP[type]);
    },
    [setFields],
  );

  return (
    <Stack gap={0} size="sm">
      <InputLabel>Score Locked Configuration</InputLabel>
      <Text size="xs" c="dark" mb={3}>
        Select a set of name or tags combined with level+warden for each slot.
        This is a rigid format but will specify exact score for the selected
        slots.
      </Text>
      <Table withTableBorder>
        <Thead>
          <Tr>
            <Th borderLeft>
              <CheckButton
                onClick={() => set("*", "slot")}
                label="Slot Alone"
              />
            </Th>
            <Th>
              <CheckButton onClick={() => set("*", "name")} label="Name+Slot" />
            </Th>
            <Th>
              <CheckButton
                disabled={!hasTags}
                onClick={hasTags ? () => set("*", "tags") : undefined}
                label="Tags+Slot"
              />
            </Th>
            <Th borderLeft borderRight width={70}>
              Exclude
            </Th>
            <Th ta="right" w={70}>
              Might
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {party.map((slot) => (
            <RadioContext
              onChange={(e) => {
                set(slot.name, e.target.value);
              }}
              value={data[slot.name] || "exclude"}
              key={slot.name}
            >
              <Row slot={slot} hasTags={hasTags} />
            </RadioContext>
          ))}
        </Tbody>
        <Tfoot>
          <Tr
            style={{
              borderTop: "2px dashed var(--mantine-color-default-border)",
            }}
          >
            <Td
              ta="right"
              ff="mono"
              colSpan={4}
              fw="bold"
              c="light-dark(var(--mantine-color-orange-5), var(--mantine-color-yellow-4))"
            >
              Total Might
            </Td>
            <Td
              ta="right"
              ff="mono"
              fw="bold"
              c="light-dark(var(--mantine-color-orange-5), var(--mantine-color-yellow-4))"
            >
              {totalMight}
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </Stack>
  );
};

const Row = ({ slot, hasTags }) => (
  <Tr>
    <RadioCell value="slot" slot={slot} />
    <RadioCell value="name" slot={slot} label={slot.name} />
    <RadioCell
      value="tags"
      slot={slot}
      notApplicable={!hasTags}
      label={slot.tags.join("+")}
    />
    <RadioCell
      value="exclude"
      py={0}
      label={<IconTrash size={24} />}
      borderLeft
      hiddenRadio
      borderRight
    />
    <Td ff="mono" ta="right">
      {slot.might}
    </Td>
  </Tr>
);
