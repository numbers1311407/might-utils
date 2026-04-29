import { useState, useMemo, use } from "react";
import {
  ActionIcon,
  Box,
  Button,
  CheckIcon,
  Group,
  Radio,
  RadioGroupContext,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useId } from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { TextInput, TagGroupsSelect } from "@/core/components";
import { rulesetSchema } from "@/model/schemas";
import { useRulesStoreApi as storeApi } from "@/model/store";
import { useStableCallback, useTagGroup } from "@/core/hooks";
import { intersection } from "@/utils";

const { Tr, Td, Th, Tbody, Tfoot, Thead } = Table;

const CheckButton = (props) => {
  return (
    <ActionIcon size="xs" bdrs={0} mr="xs" {...props}>
      <CheckIcon size={12} />
    </ActionIcon>
  );
};

const formSchema = rulesetSchema.refine(
  (record) => storeApi.nameAvailable(record),
  {
    message: "Name is already taken",
    path: ["name"],
  },
);

const focusInput = (el) => setTimeout(() => el?.focus(), 50);

const Success = ({ navigate, cancel }) => (
  <Stack gap="sm">
    <Group align="flex-start" p="sm">
      <Box c="success">
        <CheckIcon size={32} />
      </Box>
      <Text size="md" py={6}>
        Your ruleset has been created.
      </Text>
    </Group>
    <Group justify="flex-end">
      <Button variant="outline" onClick={cancel}>
        Close and continue
      </Button>
      <Button onClick={navigate}>Edit it now?</Button>
    </Group>
  </Stack>
);

const RadioContext = ({
  value: _value,
  size,
  onChange: _onChange,
  children,
}) => {
  const name = useId();
  const onChange = useStableCallback((event) => {
    _onChange?.(event);
  });
  const value = {
    value: _value,
    size,
    onChange,
    name,
  };
  return <RadioGroupContext value={value}>{children}</RadioGroupContext>;
};

const usePartyTagGroupState = (party, initialTagGroupId = "") => {
  const [tagGroupId, setTagGroupId] = useState(initialTagGroupId);
  const [tagGroup] = useTagGroup(tagGroupId);
  const map = useMemo(() => {
    if (!tagGroup) {
      return null;
    }
    return (party || []).reduce(
      (map, slot) => map.set(slot.name, intersection(slot.tags, tagGroup.tags)),
      new Map(),
    );
  }, [party, tagGroup]);

  return [tagGroupId, setTagGroupId, map];
};

const getTagGroupFilter = (party) => (group) => {
  return party.chars.every(
    (slot) => !!intersection(slot.tags, group.tags).length,
  );
};

export const RulesetCreateForm = ({
  record,
  tagGroupId: propsTagGroupId,
  navigate,
  cancel,
  onSubmit,
}) => {
  const { party, ...draft } = record;
  const { data: initialValues = {} } = formSchema.safeParse(draft);
  const [submitted, setSubmitted] = useState(false);

  const [tagGroupId, setTagGroupId, tagGroupsMap] = usePartyTagGroupState(
    party?.chars,
    propsTagGroupId,
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: zod4Resolver(formSchema),
  });

  const onFormSubmit = (values) => {
    onSubmit?.(values);
  };

  const onFormValidationFail = () => {
    setSubmitted(true);
  };

  if (navigate) {
    return <Success navigate={navigate} cancel={cancel} />;
  }

  return (
    <form onSubmit={form.onSubmit(onFormSubmit, onFormValidationFail)}>
      <Stack gap="sm">
        <TextInput
          label="Name"
          size="sm"
          ref={focusInput}
          description="Name to describe your ruleset"
          placeholder="Enter name"
          key={form.key("name")}
          onKeyUp={() => {
            if (submitted) form.validate();
          }}
          {...form.getInputProps("name")}
        />

        <TagGroupsSelect
          value={tagGroupId}
          onChange={setTagGroupId}
          filter={getTagGroupFilter(party)}
        />

        <PartyCreator party={party} tagGroupsMap={tagGroupsMap} />

        <Group justify="flex-end">
          <Button variant="subtle" onClick={cancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

const CheckboxCell = ({ label, value, ...props }) => {
  return (
    <Td bg="var(--mantine-color-body)" {...props}>
      <Radio label={label} value={value} w="100%" />
    </Td>
  );
};

const border = "1px solid var(--mantine-color-default-border)";

const PartyCreatorRow = ({ slot, tagGroupsMap }) => (
  <Tr>
    <Td ff="mono" style={{ borderRight: border }}>
      {slot.level} {slot.warden ? `Rk. ${slot.warden}` : ""}
    </Td>
    <CheckboxCell value="slot" label="Slot" />
    <CheckboxCell label={slot.name} value="name" />
    {tagGroupsMap && (
      <CheckboxCell
        label={tagGroupsMap.get(slot.name).join("+")}
        value="tags"
      />
    )}
    <CheckboxCell
      bg="zinc.5"
      value="drop"
      label="Drop"
      style={{ borderLeft: border, borderRight: border }}
    />
    <Td ff="mono" ta="right">
      {slot.might}
    </Td>
  </Tr>
);

const PartyCreator = ({ party, tagGroupsMap }) => {
  const bg = "secondary.8";
  const [state, setState] = useState({
    Difa: "slot",
    Geese: "slot",
    Guta: "slot",
    Huffpo: "slot",
    Kwok: "slot",
  });

  const selectAll = (value, ifValue) => {
    setState((state) =>
      Object.keys(state).reduce(
        (o, key) => ({
          ...o,
          [key]: !ifValue || ifValue === state[key] ? value : state[key],
        }),
        {},
      ),
    );
  };

  const onChange = (name, value) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  return (
    <>
      <Text size="sm"></Text>
      <Table withTableBorder bg="var(--mantine-color-body-custom)">
        <Thead>
          <Tr bd="none">
            <Th></Th>
            <Th
              bg={bg}
              colSpan={tagGroupsMap ? 3 : 2}
              style={{ borderLeft: border, borderRight: border }}
            >
              Include by...
            </Th>
            <Th
              bg="zinc.5"
              style={{ borderLeft: border, borderRight: border }}
            ></Th>
            <Th></Th>
          </Tr>
          <Tr>
            <Th w={105}>Slot</Th>
            <Th w={80} style={{ borderLeft: border }} bg={bg}>
              <CheckButton onClick={() => selectAll("slot")} /> Slot
            </Th>
            <Th bg={bg}>
              <CheckButton onClick={() => selectAll("name")} /> Name+Slot
            </Th>
            {tagGroupsMap && (
              <Th bg={bg}>
                <CheckButton onClick={() => selectAll("tags")} /> Tags+Slot
              </Th>
            )}
            <Th
              style={{ borderLeft: border, borderRight: border }}
              bg="zinc.5"
              width={70}
            >
              Drop
            </Th>
            <Th ta="right" w={70}>
              Might
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {party.chars.map((slot) => (
            <RadioContext
              onChange={(e) => {
                onChange(slot.name, e.target.value);
              }}
              value={state[slot.name]}
              key={slot.name}
            >
              <PartyCreatorRow slot={slot} tagGroupsMap={tagGroupsMap} />
            </RadioContext>
          ))}
        </Tbody>
        <Tfoot>
          <Tr
            style={{
              borderTop: "2px dashed var(--mantine-color-default-border)",
            }}
          >
            <Td ta="right" ff="mono" colSpan={tagGroupsMap ? 5 : 4}>
              Total Might
            </Td>
            <Td ta="right" ff="mono">
              510
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </>
  );
};
