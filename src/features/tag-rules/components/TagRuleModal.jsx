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
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";

const typeHelp =
  "Rules work by counting character tags or attributes like level & class, and requiring that the " +
  "count falls within the defined range to qualify the squad as valid. For a name type rule, the " +
  "range is always 1.";

const sizeHelp =
  "The size range defines each group size for which this rule applies. Each size can only have one " +
  "rule per combination of type, value, and warden requirement. If a conflict is found, the rule with " +
  "the higher size range will take precedence.";

const rangeHelp =
  'A single number ("1") represents an exact count. Appending +/- ("1+" or "1-") would mean at least 1 ' +
  'or at most 1, respectively. A range is expressed with a hyphen, e.g. "1-3" would mean between 1 and 3. ' +
  'and finally asterisk ("*") means everyone in the group.';

const wardenHelp =
  "Rules can specify warden rank, but note that this increases the specificity of the rule. " +
  'For instance you can specify exactly 1 "tank" with rk. 2, but that will not affect inclusion of ' +
  "tanks with different ranks. This is by design for flexibility. If you want to require exactly " +
  "1 tank with a specific warden rank, you need two rules: one requiring a tank with warden rk. X, and " +
  'one requiring 1 tank of "Any" warden status.';

export const TagRuleModal = ({ onClose, onSubmit, opened, rule, ruleset }) => {
  return (
    <Modal
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
        onSubmit={(rule) => {
          onSubmit(rule);
        }}
      />
    </Modal>
  );
};

export const TagRuleModalButton = ({ rule, children, onSubmit, ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <TagRuleModal
        opened={opened}
        onClose={() => close()}
        onSubmit={(rule) => {
          close();
          onSubmit(rule);
        }}
        rule={rule}
        {...props}
      />
      <Button variant="default" onClick={open}>
        {children || (rule ? "Edit" : "Add Rule")}
      </Button>
    </>
  );
};

const TagRuleForm = ({ rule = {}, onSubmit }) => {
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
    onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Stack gap={6}>
        <Stack mb="lg" gap="xs">
          <HelpLabel label="Size" help={sizeHelp} />
          <TagRuleSizeSlider
            key={form.key("size")}
            onChange={(value) => form.setFieldValue("size", value)}
            value={form.values.size}
          />
        </Stack>
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
            { label: "Warden Rk.", value: "warden" },
          ]}
          key={form.key("type")}
          {...form.getInputProps("type")}
        />
        <ValueField form={form} />
        <RangeField form={form} />
        <Select
          key={form.key("warden")}
          label={<HelpLabel label="Warden Rk." help={wardenHelp} />}
          placeholder="Got warden?"
          description="Should this rule require warden or a specific warden rank?"
          data={[
            { label: "Any", value: "Any" },
            { label: "Rank 0", value: "0" },
            { label: "Rank 1+", value: "1+" },
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
      label={<HelpLabel label="Count" help={rangeHelp} />}
      {...form.getInputProps("range")}
    />
  );
};
