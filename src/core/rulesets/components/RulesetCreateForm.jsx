// Disclaimer: this whole module was developed in "get it done" mode and probably
// needs major refactoring.

import { useCallback, useState, useEffect, useMemo } from "react";
import {
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
import { IconTrash } from "@tabler/icons-react";
import { useId } from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { TextInput, TagGroupsSelect } from "@/core/components";
import { rulesetSchema } from "@/model/schemas";
import {
  usePartyFinderStore,
  useRulesStoreApi as storeApi,
} from "@/model/store";
import { createRulesetFromSlots } from "../helpers";
import { useStableCallback, useTagGroup } from "@/core/hooks";
import { intersection, sum } from "@/utils";

// Make Tr & Td have baked in left/right optional and consistent borders
const { Tr, Tbody, Tfoot, Thead } = Table;
const borderStyle = "1px solid var(--mantine-color-default-border)";
const BorderedBox = ({ borderLeft, borderRight, ...props }) => (
  <Box
    style={{
      ...props.style,
      borderLeft: borderLeft ? borderStyle : undefined,
      borderRight: borderRight ? borderStyle : undefined,
    }}
    {...props}
  />
);
const Td = (props) => <BorderedBox component={Table.Td} {...props} />;
const Th = (props) => <BorderedBox component={Table.Th} {...props} />;

// Basic check button for the select all header buttons
const CheckButton = ({ label, ...props }) => {
  return (
    <Button size="compact-xs" leftSection={<CheckIcon size={14} />} {...props}>
      <Text size="sm">{label}</Text>
    </Button>
  );
};

const formSchema = rulesetSchema.refine(
  (record) => storeApi.nameAvailable(record),
  {
    message: "Name is already taken",
    path: ["name"],
  },
);

// There's probably a better workaround here for whatever reason the modal
// form won't focus on render via a useEffect without timeout, so instead just
// use a functional ref to do that but simpler.
const focusInput = (el) => setTimeout(() => el?.focus(), 50);

// Success UI
const CreateSuccess = ({ navigate, cancel }) => (
  <Stack gap="sm">
    <Group align="flex-start" p="sm">
      <Box c="success">
        <CheckIcon size={32} />
      </Box>
      <Text size="md" py={6}>
        Your ruleset has been created.
      </Text>
    </Group>
    <Group gap="sm" justify="flex-end">
      <Button size="compact-md" variant="outline" onClick={cancel}>
        Close
      </Button>
      <Button size="compact-md" onClick={() => navigate("search")}>
        Search now?
      </Button>
      <Button size="compact-md" onClick={() => navigate("ruleset")}>
        Edit it now?
      </Button>
    </Group>
  </Stack>
);

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

// Lot going on in this mess but basically it's taking a perty and creating
// a map of party member names to their intersection of tags with the found
// tag group, and is defaulting that tag group via party finder options.
//
// if that map is null because the tag group doesn't exist or the tag group
// is invalid for this party, it will return a blank tagGroupId "" which will
// result in the tag group select showing "None" and the lacking map results
// in the UI disabling the tags+slot row.
//
// This works in combination with the filtering of tag options and is only
// necessary for the case where it's attempting to default to the current
// party finder tag group ID, but that group is not valid for the party.
//
// How this default is stored is some legacy tech debt related to how the
// old grouping code worked, and could probably use a refactor.
const usePartyTagGroupState = (party) => {
  const groupBy = usePartyFinderStore((store) => store.options.groupBy);
  const tagGroupIdWithDefault = groupBy.startsWith("tag:")
    ? groupBy.split(":")[1]
    : null;
  const [tagGroupId, setTagGroupId] = useState(tagGroupIdWithDefault);
  const [tagGroup] = useTagGroup(tagGroupId);
  const map = useMemo(() => {
    if (!tagGroup) {
      return null;
    }
    return (party || []).reduce((map, slot) => {
      if (!map) return null;
      const tags = intersection(slot.tags, tagGroup.tags);
      return tags.length ? map.set(slot.name, tags) : null;
    }, new Map());
  }, [party, tagGroup]);
  return [map ? tagGroupId : "", setTagGroupId, map];
};

// For a tag grouping to work every party member has to have at least one tag,
// so this component is just filtering out bad options.
const FilteredTagGroupsSelect = ({ party, ...props }) => {
  const filter = useCallback(
    (group) => {
      return party.every(
        (slot) => !!intersection(slot.tags, group.tags).length,
      );
    },
    [party],
  );
  return <TagGroupsSelect filter={filter} {...props} />;
};

// simple useState wrapper providing a default party state, preselecting the
// option for all party members
const usePartyState = (party, defaultState = "slot") => {
  return useState(() => {
    return party.reduce(
      (state, char) => ({ ...state, [char.name]: defaultState }),
      {},
    );
  });
};

export const RulesetCreateForm = ({
  record,
  tagGroupId: propsTagGroupId,
  navigate,
  cancel,
  onSubmit,
}) => {
  const { party, ...draft } = record;
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = usePartyState(party);
  const { data: initialValues = {} } = formSchema.safeParse(draft);

  const [tagGroupId, setTagGroupId, tagGroupsMap] = usePartyTagGroupState(
    party,
    propsTagGroupId,
  );

  // This is a mess and probably should be refactored
  const rules = useMemo(() => {
    const config = party.reduce((acc, char) => {
      const ruleType = state[char.name];

      if (ruleType !== "exclude") {
        let key = `${char.warden}|${char.level}`;

        if (ruleType === "name") {
          key += `|name:${char.name}`;
        } else if (ruleType === "tags") {
          key += `|tags:${tagGroupsMap.get(char.name).join(",")}`;
        }

        acc.set(key, (acc.get(key) || 0) + 1);
      }

      return acc;
    }, new Map());

    const slots = Array.from(config.entries()).map(([key, count]) => {
      const [warden, level, tuple = ""] = key.split("|");
      const [type, value] = tuple.split(":");
      const baseConfig = {
        count,
        warden: Number(warden),
        level: Number(level),
      };
      if (type) {
        baseConfig[type] = type === "tags" ? value.split(",") : value;
      }
      return baseConfig;
    });

    return createRulesetFromSlots(slots);
  }, [party, state, tagGroupsMap]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      ...initialValues,
      rules,
    },
    validate: zod4Resolver(formSchema),
  });

  const setFieldValue = useStableCallback((field, value) => {
    form.setFieldValue(field, value);
  });

  useEffect(() => {
    setFieldValue("rules", rules);
  }, [setFieldValue, rules]);

  const onFormSubmit = (values) => {
    onSubmit?.(values);
  };

  const onFormValidationFail = (...args) => {
    console.log(args);
    setSubmitted(true);
  };

  if (navigate) {
    return <CreateSuccess navigate={navigate} cancel={cancel} />;
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

        <FilteredTagGroupsSelect
          description={
            'Tag groups can make rules more generic, e.g. any char tagged "healer"' +
            "vs. a specific cleric by name"
          }
          party={party}
          value={tagGroupId}
          onChange={setTagGroupId}
        />

        {form.errors?.rules ? (
          <Text size="sm" c="error">
            An unexpected error occurred, please re-open this form and try
            again.
          </Text>
        ) : (
          <>
            <Text size="sm" c="dark">
              Configure how specific your ruleset will be. "Slot Alone" will
              only look for the level+warden combination, but you can also
              specify characters by name or by tag groups. Note if you specify
              all characters by name the ruleset will only match this group
              exactly, so in reality you probably want to rely on slots, tags,
              or some combination of the 3 types.
            </Text>
            <Text size="sm" c="dark">
              This is all further customizable in the rules editor UI after
              creation. This is just a starting point.
            </Text>
          </>
        )}

        <PartyCreator
          state={state}
          setState={setState}
          party={party}
          tagGroupsMap={tagGroupsMap}
        />

        <Group justify="flex-end">
          <Button variant="subtle" onClick={cancel}>
            Cancel
          </Button>
          <Button disabled={!rules.length} type="submit">
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const CheckboxCell = ({
  notApplicable = false,
  label: _label,
  slot,
  value,
  ...props
}) => {
  const slotLabel = (slot) =>
    slot ? `${slot.level} ${slot.warden ? `Rk. ${slot.warden}` : ""}` : "";
  const label =
    !_label || typeof _label !== "object"
      ? `${_label || ""}${_label && slot ? " @ " : ""}${slotLabel(slot)}`
      : _label;
  return (
    <Td {...props}>
      {notApplicable ? "n/a" : <Radio label={label} value={value} w="100%" />}
    </Td>
  );
};

const PartyCreatorRow = ({ slot, tagGroupsMap }) => (
  <Tr>
    <CheckboxCell value="slot" slot={slot} />
    <CheckboxCell value="name" slot={slot} label={slot.name} />
    <CheckboxCell
      value="tags"
      slot={slot}
      notApplicable={!tagGroupsMap}
      label={tagGroupsMap?.get(slot.name).join("+")}
    />
    <CheckboxCell
      value="exclude"
      label={<IconTrash size={18} />}
      borderLeft
      borderRight
    />
    <Td ff="mono" ta="right">
      {slot.might}
    </Td>
  </Tr>
);

const PartyCreator = ({ party, state, setState, tagGroupsMap }) => {
  // This little bit of tech debt sets every option in state to a specific
  // value but optionally takes an `ifValue` param which limits the change
  // to only values currently holding that `ifValue`. The purpose of this is
  // to change all values that were set to "tags" when the tag map disappears
  const selectAll = useCallback(
    (value, ifValue) => {
      setState((state) =>
        Object.keys(state).reduce(
          (o, key) => ({
            ...o,
            [key]: !ifValue || ifValue === state[key] ? value : state[key],
          }),
          {},
        ),
      );
    },
    [setState],
  );

  useEffect(() => {
    if (!tagGroupsMap) {
      selectAll("slot", "tags");
    }
  }, [selectAll, tagGroupsMap]);

  const nonExcludedMight = useMemo(() => {
    const excluded = Object.entries(state)
      .filter(([, value]) => value === "exclude")
      .map(([name]) => name);

    return sum(
      party
        .filter((slot) => !excluded.includes(slot.name))
        .map(({ might }) => might),
    );
  }, [party, state]);

  // radios can't be clicked "off" so it feels a bit awkward to
  // have a boolean param here but so be it.
  const toggleStateValue = (name, value) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  return (
    <>
      <Table withTableBorder>
        <Thead>
          <Tr>
            <Th borderLeft>
              <CheckButton
                onClick={() => selectAll("slot")}
                label="Slot Alone"
              />
            </Th>
            <Th>
              <CheckButton
                onClick={() => selectAll("name")}
                label="Name+Slot"
              />
            </Th>
            <Th>
              <CheckButton
                disabled={!tagGroupsMap}
                onClick={tagGroupsMap ? () => selectAll("tags") : undefined}
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
                toggleStateValue(slot.name, e.target.value);
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
              {nonExcludedMight}
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </>
  );
};
