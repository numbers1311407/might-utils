import {
  Button,
  Group,
  InputWrapper,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useCallback } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";

import { MightMinLevel, MightMaxLevel } from "@/core/config/might";
import { HelpLabel } from "@/core/components";
import { tagRuleSchema } from "@/core/schemas";
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";
import { QueryBuilder } from "./QueryBuilder.jsx";

const typeHelp =
  "Rules work by counting character tags or attributes like level & class, and requiring that the " +
  "count falls within the defined range to qualify the party as valid. For a name type rule, the " +
  "range is always 1.";

const sizeHelp =
  "The size range defines each group size for which this rule applies. Each size can only have one " +
  "rule per combination of type, value, and warden requirement. If a conflict is found, the rule with " +
  "the higher size range will take precedence.";

export const TagRuleModal = ({ onClose, onSubmit, opened, rule, ruleset }) => {
  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={rule ? `Edit Rule` : `New Rule`}
    >
      <TagRuleForm
        // note this key hack is to get around mantine's aggressive form caching
        key={opened ? "opened" : "closed"}
        rule={rule}
        ruleset={ruleset}
        onClose={onClose}
        onSubmit={(rule) => {
          onSubmit(rule);
        }}
      />
    </Modal>
  );
};

const TagRuleForm = ({ rule = {}, onClose, onSubmit }) => {
  const parsed = tagRuleSchema.safeParse(rule);
  const initialValues = parsed.success
    ? parsed.data
    : { type: "tag", value: "", size: [1, 20] };

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: zod4Resolver(tagRuleSchema),
  });

  const onFormSubmit = (values) => {
    console.log({ values });
    return;
    // onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Stack gap="md">
        <Stack mb="lg" gap="xs">
          <HelpLabel label="Size" help={sizeHelp} />
          <TagRuleSizeSlider
            key={form.key("size")}
            onChange={(value) => form.setFieldValue("size", value)}
            value={form.values.size}
          />
        </Stack>
        <TypeField form={form} />
        <QueryField form={form} />
        <Group justify="flex-end" gap={6}>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

const TypeField = ({ form }) => (
  <Select
    withAsterisk
    label={<HelpLabel label="Type" help={typeHelp} />}
    placeholder="What type of rule is this?"
    allowDeselect={false}
    description={
      {
        all: "This rule will apply to all party members",
        count: "This rule will apply to a numeric range of characters",
        char: "This rule will apply to a specific character",
      }[form.values.type] ||
      "Type defines what party members the rule applies to"
    }
    data={[
      { label: "Character", value: "char" },
      { label: "Range", value: "range" },
      { label: "All", value: "all" },
    ]}
    key={form.key("type")}
    {...form.getInputProps("type")}
  />
);

const QueryField = ({ form }) => {
  const onQueryChange = useCallback(
    (query) => {
      form.setFieldValue("query", query);
    },
    [form],
  );

  return (
    <InputWrapper
      description="Add individual or grouped rules with and/or logic"
      label="Query"
      withAsterisk
    >
      <QueryBuilder
        my={4}
        query={form.values.query}
        onQueryChange={onQueryChange}
      />
    </InputWrapper>
  );
};

const ValueField = ({ form }) => {
  const initialType = form.getValues().type || "tag";
  const [state, setState] = useState(initialType);

  form.watch("type", ({ value: type }) => {
    setState(type);
    const defaultValue = {
      class: "BER",
      level: 65,
      name: "",
      tag: "",
      warden: "warden",
    }[type];
    form.setFieldValue("value", defaultValue);
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
        {...props}
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
  } else if (state === "warden") {
    return null;
  }

  return null;
};
