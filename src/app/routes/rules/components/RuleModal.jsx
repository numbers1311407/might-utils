import {
  Button,
  Group,
  InputWrapper,
  Modal,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useMemo, useState } from "react";

import { useStableCallback } from "@/core/hooks";
import { HelpLabel } from "@/core/components/HelpLabel";
import { tagRuleSchema } from "@/model/schemas";
import { RuleSizeSlider } from "./RuleSizeSlider.jsx";
import { QueryBuilder } from "./QueryBuilder.jsx";
import { ModalRangeInput } from "./ModalRangeInput.jsx";

const typeHelp =
  'Use caution with "All" type rules. They are intended for niche cases like possession of flag/keys, or full ' +
  "parties of beastlords, and can easily prevent all results if a single character doesn't pass.";

const sizeHelp =
  "The size range defines each group size for which this rule applies. Each size can only have one " +
  "rule per combination of type, value, and warden requirement. If a conflict is found, the rule with " +
  "the higher size range will take precedence.";

const queryHelp =
  "Click +Rule to add a rule and begin. If the UI is unclear, consider the top level to be Group 1, " +
  "and each Group a wrapped set of Rules in parentheses, nesting further as you add more groups; Any " +
  "is like OR for a group, while All is AND. E.g. a rule might be (\"tags includes 'tank' AND " +
  '(level >= 68 OR (level >= 66 AND warden >= 1)))"';

export const RuleModal = ({ onClose, onSubmit, opened, rule, ruleset }) => {
  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={rule ? `Edit Rule` : `New Rule`}
    >
      <RuleForm
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

const RuleForm = ({ rule = {}, onClose, onSubmit }) => {
  const parsed = tagRuleSchema.safeParse(rule);
  const initialValues = parsed.success
    ? parsed.data
    : { type: "range", value: [1], size: [1, 20] };

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
        <QueryField form={form} error={form.errors.query} />
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
      <RuleSizeSlider
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
    label={<HelpLabel label="Who is required to pass?" help={typeHelp} />}
    allowDeselect={false}
    placeholder="Select type"
    description={
      <>
        A{" "}
        <Text span size="xs" fw="bold" c="warning">
          specific count
        </Text>{" "}
        of characters, or{" "}
        <Text span size="xs" fw="bold" c="warning">
          ALL
        </Text>{" "}
        characters (most rules will be a count)
      </>
    }
    data={[
      { label: "A specific count of characters", value: "range" },
      { label: "All characters", value: "all" },
    ]}
  />
);

const QueryField = ({ form }) => {
  // Note the great lengths gone to here to prevent RQB from going haywire and crashing
  // the page. It may be a good query builder, but calling it "react" anything is laughable
  // given how it breaks nearly every react idiom in wild fashion.  It will directly modify
  // the query prop given to it even if it's in "uncontrolled" mode. Similarly it will
  // render infinitely and crash if the default query its given is static! I expect some of
  // the double memoization and other oddities here are overkill, but it was a long battle
  // getting this thing to not crash the app regularly even for a textbook implementation.
  const onQueryChange = useStableCallback((query) => {
    form.setFieldValue("query", query);
  });

  const [stableQuery] = useState(form.values.query);

  return (
    <InputWrapper
      description="Combine rules with and/or logic to create your generator rule query"
      label={<HelpLabel help={queryHelp} label="Query" />}
      withAsterisk
    >
      <QueryBuilder my={4} query={stableQuery} onQueryChange={onQueryChange} />
    </InputWrapper>
  );
};

const ValueField = ({ form, error, onChange: propsOnChange, defaultValue }) => {
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
    }[type];
    onChange(defaultValue);
  });

  if (type === "range") {
    return (
      <InputWrapper
        label="Count"
        description="How many characters should satisfy this rule?"
        withAsterisk
        error={error}
        {...form.getInputProps("value.0")}
        {...form.getInputProps("value.1")}
      >
        <ModalRangeInput value={value} onChange={onChange} />
      </InputWrapper>
    );
  }

  return null;
};
