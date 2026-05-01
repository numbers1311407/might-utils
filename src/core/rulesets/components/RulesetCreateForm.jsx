import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  CheckIcon,
  Group,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { TextInput, HelpIconTooltip } from "@/core/components";
import { rulesetSchema } from "@/model/schemas";
import { useRulesStoreApi as storeApi } from "@/model/store";
import { createRulesetFromSlots } from "../helpers";
import { useStableCallback } from "@/core/hooks";
import { usePartyTagGroupState } from "../hooks/use-party-tag-group-state.js";
import { usePartyState } from "../hooks/use-party-state.js";
import { LockedTableForm } from "./LockedTableForm.jsx";
import { UnlockedTableForm } from "./UnlockedTableForm.jsx";
import { FilteredTagGroupsSelect } from "./FilteredTagGroupsSelect.jsx";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { sum } from "@/utils";

const formSchema = rulesetSchema.refine(
  (record) => storeApi.nameAvailable(record),
  {
    message: "Name is already taken",
    path: ["name"],
  },
);

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

const LockButton = ({ checked, onChange }) => {
  return (
    <Group align="center" gap="xs">
      <Switch
        size="md"
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        label={
          <Group gap={8} align="center">
            {checked ? (
              <>
                <IconLock size={24} /> Score Locked
              </>
            ) : (
              <>
                <IconLockOpen size={24} /> Score Unlocked
              </>
            )}
          </Group>
        }
      />
      <HelpIconTooltip
        w={300}
        tooltip={
          "With a locked score the rules will be rigid and always include level " +
          "and warden. If unlocked, the rules will be much more flexible, but the " +
          "score will vary with."
        }
      />
    </Group>
  );
};

export const RulesetCreateForm = ({ record, navigate, cancel, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [scoreLocked, setScoreLocked] = useState(false);

  const { party: persistedParty, ...draft } = record;
  const { data: initialValues = {} } = formSchema.safeParse(draft);

  // TODO This is all more complex than it should be but it was easier
  // to make it worse than better. It should probably be refactored
  //
  // First we're using this convoluted hook which serves a few purposes:
  // It fetches the current tag group using the legacy tag groups option
  // in the finder (which also needs a refactor as it's a relic of the
  // older system), then it runs over that tag group and restricts each
  // party members tags to be only the intersection. That tag-stripped
  // party is returned and used throughout this component, so we no longer
  // have to worry about separating out tags: the user only has tags valid
  // for the tag group. If the tag group doesn't apply to the party fully,
  // the ID is not returned leading to "None" in the tag group select and
  // a state of `hasTags: false`, so the rest of the UI will act as though
  // the user does not have any tags.
  //
  // That's only half though, the tag select itself also filters in the
  // same intersection, so it will only return options that are valid.
  const [tagGroupId, setTagGroupId, party] =
    usePartyTagGroupState(persistedParty);

  // No tag group ID, no tags rules options.
  const hasTags = !!tagGroupId;

  // Then we have this map which tracks the fielda a user wants to
  // save in the ruleset, extracted from the party.
  const [
    partyFieldsMap,
    { addFields, removeFields, setFields, toggleField, exclude },
  ] = usePartyState(party);

  // For "locked" type rulesets where warden and level are fixed,
  // we derive a state here of grouped types by name, where all
  // 3 types include level & warden, and name and tags also append
  // their values. It's derived from the base state and used for
  // the locked form table, and changes made from that table
  // are made on the partyFieldMap directly and then re-derived.
  const lockedState = useMemo(() => {
    const state = {};
    for (const [name, fields] of partyFieldsMap.entries()) {
      if (hasTags && fields.includes("tags")) {
        state[name] = "tags";
      } else if (fields.includes("name")) {
        state[name] = "name";
      } else {
        state[name] = "slot";
      }
    }
    return state;
  }, [partyFieldsMap, hasTags]);

  // On rules generation, depending on locked mode, we then convert
  // the derived locked state back into slots using the reverse of
  // the lockedState derivation.
  //
  // If we're not in locked state, we can just push all the fields
  // through.
  //
  // The reason we rely on 2 data types here and modify one directly
  // is so if the user jumps back and forth between locked and
  // unlocked mode, nothing changes, but on submit, the state
  // respected is the one matching the scoreLocked mode.
  const rules = useMemo(() => {
    const slots = party.reduce((slots, slot) => {
      const fields = partyFieldsMap.get(slot.name);
      if (!fields?.length) {
        return slots;
      }
      if (scoreLocked) {
        const type = lockedState[slot.name];
        const entry = { level: slot.level, warden: slot.warden };
        if (type === "name") {
          entry.name = slot.name;
        } else if (type === "tags") {
          entry.tags = slot.tags;
        }
        slots.push(entry);
      } else {
        slots.push(
          fields.reduce((o, field) => ({ ...o, [field]: slot[field] }), {}),
        );
      }
      return slots;
    }, []);

    return createRulesetFromSlots(slots, { count: "minimum" });
  }, [party, partyFieldsMap, scoreLocked, lockedState]);

  // calculate party might minus the excluded slots
  const totalMight = useMemo(() => {
    return sum(
      party
        .filter((slot) => partyFieldsMap.has(slot.name))
        .map(({ might }) => might),
    );
  }, [party, partyFieldsMap]);

  console.log({
    lockedState,
    partyFieldsMap,
    rules: rules.map((rule) => rule.query.rules),
    rulesCounts: rules.map((rule) => rule.value),
  });

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
      <Stack gap="md">
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
          party={persistedParty}
          value={tagGroupId}
          onChange={setTagGroupId}
          ifEmpty={
            <Text c="dark" size="xs">
              No tag groups are available for this party. Each character must
              hold at least one tag from a tag group for it to be applicable.
            </Text>
          }
        />

        {form.errors?.rules && (
          <Text size="sm" c="error">
            An unexpected error occurred, please re-open this form and try
            again.
          </Text>
        )}

        {scoreLocked ? (
          <LockedTableForm
            data={lockedState}
            setFields={setFields}
            party={party}
            totalMight={totalMight}
            hasTags={hasTags}
          />
        ) : (
          <UnlockedTableForm
            exclude={exclude}
            map={partyFieldsMap}
            toggleField={toggleField}
            addFields={addFields}
            removeFields={removeFields}
            party={party}
            hasTags={hasTags}
          />
        )}

        <Group>
          <Box flex="1">
            <LockButton checked={scoreLocked} onChange={setScoreLocked} />
          </Box>
          <Button variant="subtle" onClick={cancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!rules.length}>
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
