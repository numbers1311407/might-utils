import {
  Button,
  Group,
  InputWrapper,
  Modal,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useCallback, useEffect } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";

import { useStableCallback } from "@/core/hooks";
import { CharSelect } from "@/core/components/chars";
import { HelpLabel } from "@/core/components/common/HelpLabel";
import { tagRuleSchema } from "@/core/schemas";
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";
import { QueryBuilder } from "./QueryBuilder.jsx";
import { ModalRangeInput } from "./ModalRangeInput.jsx";

const typeHelp =
  "Rules work by counting character tags or attributes like level & class, and requiring that the " +
  "count falls within the defined range to qualify the party as valid. For a name type rule, the " +
  "range is always 1.";

const sizeHelp =
  "The size range defines each group size for which this rule applies. Each size can only have one " +
  "rule per combination of type, value, and warden requirement. If a conflict is found, the rule with " +
  "the higher size range will take precedence.";

const queryHelp =
  "Click +Rule to add a rule and begin. If the UI is unclear, consider the top level to be Group 1, " +
  "and each Group a wrapped set of Rules in parentheses, nesting further as you add more groups; Any " +
  "is essenitally OR for a group, while All is AND. E.g. a rule might be (\"tags includes 'tank' AND " +
  '(level >= 68 OR (level >= 66 AND warden > 1)))"';

export const TagRuleModal = ({ onClose, onSubmit, opened, rule, ruleset }) => {
  return (
    <Modal
      size="lg"
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
    : { type: "all", value: "all", size: [1, 20] };

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: zod4Resolver(tagRuleSchema),
  });

  const onFormSubmit = (values) => {
    onSubmit(values);
  };

  const onFormSubmitFailure = (...args) => {};

  return (
    <form onSubmit={form.onSubmit(onFormSubmit, onFormSubmitFailure)}>
      <Stack gap="md">
        <SizeField
          form={form}
          key={form.key("size")}
          {...form.getInputProps("size")}
        />
        <TypeField
          form={form}
          key={form.key("type")}
          {...form.getInputProps("type")}
        />
        <ValueField
          form={form}
          key={form.key("value")}
          {...form.getInputProps("value")}
        />
        <QueryField
          form={form}
          key={form.key("query")}
          {...form.getInputProps("query")}
        />
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

const SizeField = ({ error, onChange, defaultValue }) => {
  const [size, setSize] = useState(defaultValue);

  const sizeMessage = useMemo(() => {
    return size === undefined
      ? ""
      : size[0] === size[1]
        ? `Applies to parties of size ${size[0]}`
        : `Applies to parties of size ${size[0]} to ${size[1]}`;
  }, [size]);

  return (
    <Stack mb="lg" gap="xs">
      <Group>
        <HelpLabel error={error} label="Size" help={sizeHelp} />
        <Text ta="right" flex="1" size="sm" c="dark">
          {sizeMessage}
        </Text>
      </Group>
      <TagRuleSizeSlider
        onChange={(value) => {
          setSize(value);
          onChange(value);
        }}
        value={defaultValue}
      />
      {error && (
        <Text c="error" size="sm" mt="md">
          {error}
        </Text>
      )}
    </Stack>
  );
};

const TypeField = ({ form, ...props }) => (
  <Select
    {...props}
    withAsterisk
    label={<HelpLabel error={props.error} label="Type" help={typeHelp} />}
    placeholder="What type of rule is this?"
    allowDeselect={false}
    description={
      {
        all: "All party members must satisfy this rule",
        range: "This rule will apply to a count of characters",
        char: "This rule will apply to a specific character",
      }[form.values.type] ||
      "Type defines what party members the rule applies to"
    }
    data={[
      { label: "Specific Character", value: "char" },
      { label: "Character Count", value: "range" },
      { label: "All Characters", value: "all" },
    ]}
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
      label={<HelpLabel help={queryHelp} label="Query" />}
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

const ValueField = ({
  form,
  error,
  onChange: propsOnChange,
  defaultValue,
  ...rest
}) => {
  const { type: initialType } = form.getValues();
  const [value, setValue] = useState(defaultValue);
  const [type, setType] = useState(initialType);

  const onChange = useStableCallback((value) => {
    if (value[0] === "") {
      value = [undefined, undefined];
    }
    setValue(value);
    propsOnChange?.(value);
  });

  form.watch("type", ({ value: type }) => {
    setType(type);
    const defaultValue = {
      all: "all",
      range: [1, 1],
      char: "",
    }[type];
    onChange(defaultValue);
  });

  if (type === "range") {
    return (
      <InputWrapper
        label="Count"
        description="How many characters does this rule target?"
        error={error}
        {...form.getInputProps("value.0")}
        {...form.getInputProps("value.1")}
      >
        <ModalRangeInput value={value} onChange={onChange} />
      </InputWrapper>
    );
  }
  if (type === "char") {
    return (
      <InputWrapper
        label="Character"
        description="Which character does this rule target?"
        error={error}
        {...form.getInputProps("value")}
      >
        <CharSelect mb={3} value={value} onChange={onChange} />
      </InputWrapper>
    );
  }

  return null;
};
