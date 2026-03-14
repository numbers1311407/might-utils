import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import * as z from "zod";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { MightMinLevel, MightMaxLevel } from "@/core/config/might";
import { HelpLabel } from "@/core/components";
import { charSchema, tagRuleSchema } from "@/core/schemas";

const stringifyRange = (input) => {
  if (input === "*") return input;
  if (typeof input === "number") return `${input}`;
  if (input.length === 1) return `${input}+`;
  if (input[0] === 0) return `${input[1]}-`;
  return input.join("-");
};

const parseRange = (input) => {
  const regex = /^(\*)$|^(\d+)([+-])?$|^(\d+)-(\d+)$/;
  const match = input.replace(/\s/g, "").match(regex);

  if (!match) {
    throw new Error(`Invalid constraint format: "${input}"`);
  }

  const [_full, all, singleInt, modifier, rangeMin, rangeMax] = match;

  if (all) return { type: "ALL" };

  if (rangeMin && rangeMax) {
    const min = parseInt(rangeMin, 10);
    const max = parseInt(rangeMax, 10);
    if (min > max) throw new Error("Range min cannot be greater than max");
    return { type: "RANGE", min, max };
  }

  const val = parseInt(singleInt, 10);
  if (modifier === "+") return { type: "AT_LEAST", min: val };
  if (modifier === "-") return { type: "AT_MOST", max: val };

  return { type: "EXACT", value: val };
};

const typeHelp =
  "Rules work by counting character tags or attributes like level & class, and requiring that the " +
  "count falls within the defined range to qualify the lineup as valid.For a name type rule, the " +
  "range is always 1.";

const sizeHelp =
  "Size is the number of characters required in the lineup for the rule to apply. The important thing " +
  "to understand about size is that rules of lower size merge upwards into rules of higher size until " +
  "they're overridden by a rule with the same type & value.";

const rangeHelp =
  'A single number ("1") represents an exact count. Appending +/- ("1+" or "1-") would mean at least 1 ' +
  'or at most 1, respectively. A range is expressed with a hyphen, e.g. "1-3" would mean between 1 and 3. ' +
  'and finally asterisk ("*") means everyone.';

const formSchema = tagRuleSchema
  .extend({
    size: z.coerce.number().int(),
    warden: z.string(),
    range: z.string(),
    value: z.union([z.string(), z.number()]),
  })
  .refine(
    ({ range }) => {
      try {
        parseRange(range);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Range is invalid, hover (?) to see format help.",
      path: ["range"],
    },
  );

export const TagRuleModal = ({ rule, ruleset, size, children, onSubmit }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => close()}
        closeOnClickOutside={false}
        title={rule ? `Edit Rule` : `New Rule`}
      >
        <TagRuleForm
          // note this key hack is to get around mantine's aggressive form caching
          key={opened ? "opened" : "closed"}
          rule={rule}
          ruleset={ruleset}
          size={size}
          onSubmit={(size, rule) => {
            onSubmit(size, rule);
            close();
          }}
        />
      </Modal>

      <Button variant="default" onClick={open}>
        {children || (rule ? "Edit" : "Add Rule")}
      </Button>
    </>
  );
};

const TagRuleForm = ({ rule, size, onSubmit }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      size,
      type: rule?.type || "tag",
      value: rule?.value || "",
      range: stringifyRange(rule?.range || "1"),
      warden: String(rule?.warden ?? "-1"),
    },
    transformValues: (values) => {
      const {
        size,
        range: stringRange,
        value,
        warden: stringWarden,
        ...restValues
      } = values;
      const result = parseRange(stringRange);

      const warden =
        stringWarden === "true" ? true : parseInt(stringWarden, 10);

      let range;
      switch (result.type) {
        case "ALL":
          range = "*";
          break;
        case "AT_LEAST":
          range = [Math.min(result.min, size)];
          break;
        case "AT_MOST":
          range = [0, Math.min(result.max, size)];
          break;
        case "RANGE":
          range = [result.min, result.max].map((v) => Math.min(v, size));
          break;
        case "EXACT":
          range = Math.min(result.value, size);
          break;
      }

      return {
        range,
        warden,
        value: String(value),
        size: parseInt(size, 10),
        ...restValues,
      };
    },
    validate: zod4Resolver(formSchema),
  });

  const onFormSubmit = (values) => {
    const { size, ...rule } = values;
    onSubmit(size, rule);
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Stack gap={6}>
        <NumberInput
          withAsterisk
          label={<HelpLabel label="Size" help={sizeHelp} />}
          description="This rule will apply to all groups from this size up, until overridden."
          placeholder="How deep are we rolling?"
          key={form.key("size")}
          min={1}
          max={20}
          {...form.getInputProps("size")}
        />
        <Select
          withAsterisk
          label={<HelpLabel label="Type" help={typeHelp} />}
          placeholder="What are we counting?"
          description="Type defines what this rule counts to determine pass/fail."
          data={[
            { label: "Tag", value: "tag" },
            { label: "Name", value: "name" },
            { label: "Level", value: "level" },
            { label: "Class", value: "class" },
          ]}
          key={form.key("type")}
          {...form.getInputProps("type")}
        />
        <ValueField form={form} />
        <RangeField form={form} />
        <Select
          key={form.key("warden")}
          label="Warden Status"
          placeholder="Got warden?"
          description="Should this rule require warden or a specific warden rank?"
          data={[
            { label: "Any", value: "-1" },
            { label: "Rank 0", value: "0" },
            { label: "Rank 1+", value: "true" },
            { label: "Rank 1", value: "1" },
            { label: "Rank 2", value: "2" },
            { label: "Rank 3", value: "3" },
          ]}
          {...form.getInputProps("warden")}
        />
        <Group justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

const ValueField = ({ form }) => {
  const initialType = form.getValues().type || "tag";
  const [state, setState] = useState(initialType);

  form.watch("type", ({ value: type }) => {
    setState(type);
    form.setFieldValue("value", "");
  });

  const props = {
    withAsterisk: true,
    ...form.getInputProps("value"),
  };

  if (state === "tag") {
    return (
      <TextInput
        key={form.key("value")}
        description="Personal or class tag assigned to characters for this rule."
        label="Tag"
        {...props}
      />
    );
  } else if (state === "class") {
    return (
      <Select
        key={form.key("value")}
        label="Class"
        description="Class of the characters required by this rule."
        searchable
        data={charSchema.shape.class.options}
      />
    );
  } else if (state === "level") {
    return (
      <NumberInput
        key={form.key("value")}
        label="Level"
        description="Level of the characters required by this rule."
        max={MightMaxLevel}
        min={MightMinLevel}
        {...props}
      />
    );
  } else if (state === "name") {
    return (
      <TextInput
        key={form.key("value")}
        description="Name of the character this rule requires to be in the group"
        label="Character Name"
        {...props}
      />
    );
  }

  return null;
};

const RangeField = ({ form }) => {
  const type = form.getValues().type;
  const [disabled, setDisabled] = useState(type === "name");
  const [cache, setCache] = useState(form.getValues().range);

  form.watch("type", ({ value: type }) => {
    const isName = type === "name";
    setDisabled(isName);

    if (isName) {
      setCache(form.getValues().range);
      form.setFieldValue("range", "1");
    } else {
      form.setFieldValue("range", cache);
    }
  });

  return (
    <TextInput
      key={form.key("range")}
      withAsterisk
      disabled={disabled}
      description="Count of characters who must fulfill this rule."
      label={<HelpLabel label="Range" help={rangeHelp} />}
      {...form.getInputProps("range")}
    />
  );
};
