import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import * as z from "zod";
import { capitalize } from "@/utils";
import { useDisclosure } from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { TagsInput } from "@/common/components";
import { charSchema } from "../schema";

// create a form-specific schema extension that adds roster uniquness
// validation to the character model
const formCharSchema = charSchema
  .extend({
    siblings: z.array(z.string()),
  })
  .refine(
    ({ name, siblings }) => !name || !siblings.includes(capitalize(name)),
    {
      message: "Character name is already on the roster",
      path: ["name"],
    },
  );

export const RosterCharModal = ({ roster, char, children, onSubmit }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => close()}
        title={char ? `Edit ${char.name}` : "Add Character"}
      >
        <RosterCharForm
          // note this key hack is to get around mantine's aggressive form caching
          key={opened ? "opened" : "closed"}
          char={char}
          roster={roster}
          onSubmit={(char) => {
            onSubmit(char);
            close();
          }}
        />
      </Modal>

      <Button variant="default" onClick={open}>
        {children || (char ? "Edit" : "Add Character")}
      </Button>
    </>
  );
};

const RosterCharForm = ({ char, onSubmit, roster }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: char?.name || "",
      level: char?.level,
      active: char?.active ?? true,
      class: char?.class || "",
      warden: String(char?.warden || 0),
      tags: [],
      siblings: roster
        .map(({ name }) => name)
        .filter((name) => !char || char.name !== name),
    },
    transformValues: (values) => {
      const { siblings: _, ...restValues } = values;
      return {
        ...restValues,
        warden: Number(values.warden),
      };
    },
    validate: zod4Resolver(formCharSchema),
  });

  const addTag = (tag) => {
    tag = tag.toLowerCase();
    const tags = form.getValues()?.tags || [];
    if (!tags.includes(tag)) {
      form.insertListItem("tags", tag);
    }
  };

  const removeTag = (tag) => {
    tag = tag.toLowerCase();
    const tags = form.getValues()?.tags || [];
    const idx = tags.indexOf(tag);
    if (idx !== -1) {
      form.removeListItem("tags", idx);
    }
  };

  const onFormSubmit = (char) => {
    onSubmit(char);
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <TextInput
        withAsterisk
        label="Name"
        placeholder="Character name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <NumberInput
        withAsterisk
        label="Level"
        placeholder="Character level"
        key={form.key("level")}
        {...form.getInputProps("level")}
      />
      <Select
        withAsterisk
        label="Class"
        placeholder="Select class"
        autoSelectOnBlur
        searchable
        data={charSchema.shape.class.options}
        key={form.key("class")}
        {...form.getInputProps("class")}
      />
      <Select
        withAsterisk
        label="Warden"
        placeholder="Max warden rank"
        autoSelectOnBlur
        data={[
          { label: "Unwardened", value: "0" },
          { label: "Rank 1", value: "1" },
          { label: "Rank 2", value: "2" },
          { label: "Rank 3", value: "3" },
        ]}
        key={form.key("warden")}
        {...form.getInputProps("warden")}
      />
      <TagsInput
        label="Tags"
        removeTag={removeTag}
        addTag={addTag}
        key={form.key("tags")}
        {...form.getInputProps("tags")}
      />
      <Checkbox
        label="Active"
        key={form.key("active")}
        {...form.getInputProps("active", { type: "checkbox" })}
      />
      <Group justify="flex-end">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};
