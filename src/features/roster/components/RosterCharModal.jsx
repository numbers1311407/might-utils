import {
  Button,
  Checkbox,
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
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";

import { capitalize } from "@/utils";
import { TagsInput } from "@/core/components";
import { charSchema, tagSchema } from "@/core/schemas";
import { useClassTagsStore } from "@/core/store";
import { MightMinLevel, MightMaxLevel } from "@/core/config/might";

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
        closeOnClickOutside={false}
        title={char ? `Edit Character: ${char.name}` : "New Character"}
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
  const classTags = useClassTagsStore((store) => store.tags);
  const [tagsError, setTagsError] = useState(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: char?.name || "",
      level: char?.level,
      active: char?.active ?? true,
      class: char?.class || "",
      warden: String(char?.warden || 0),
      tags: char?.tags || [],
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

  // Display "locked" tags which will be inherited from the character class  tags and
  // are unnecessary to add to characters separately. In the form these tags appear in
  // the field but aren't editable, and will prevent duplicates being added. On class
  // change we reset the class tags and strip any duplicates, which shouldn't be a big deal?
  const [lockedTags, setLockedTags] = useState(classTags?.[char?.class] || []);
  form.watch("class", ({ value }) => {
    const newClassTags = classTags[value];
    const tags = form.getValues()?.tags || [];
    setLockedTags(newClassTags);
    form.setFieldValue(
      "tags",
      tags.filter((tag) => !newClassTags.includes(tag)),
    );
  });

  const addTag = (tag) => {
    tag = tag.toLowerCase();
    const tags = form.getValues()?.tags || [];

    const result = tagSchema.safeParse(tag);

    if (!result.success) {
      setTagsError(result.error.issues[0].message);
      return;
    }

    setTagsError(null);

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
      <Stack gap={6}>
        <TextInput
          withAsterisk
          label="Character Name"
          placeholder="Character name"
          description={
            char
              ? "Note name changes will not propagate to any rules for this character"
              : undefined
          }
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <NumberInput
          withAsterisk
          label="Current Level"
          placeholder="Current character level"
          key={form.key("level")}
          min={MightMinLevel}
          max={MightMaxLevel}
          {...form.getInputProps("level")}
        />
        <Select
          withAsterisk
          label="Class"
          placeholder="Select class"
          searchable
          data={charSchema.shape.class.options}
          key={form.key("class")}
          {...form.getInputProps("class")}
        />
        <Select
          withAsterisk
          label="Warden Rank"
          placeholder="Max warden rank"
          description="Max attained, do not account for deleveling"
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
          description="Tags in addition to the base class tags, shown here as uneditable"
          removeTag={removeTag}
          addTag={addTag}
          lockedTags={lockedTags}
          key={form.key("tags")}
          // NOTE This input does not accept onChange, rather addTag and removeTag combined
          // manage the tag state
          {...form.getInputProps("tags")}
          onKeyDown={() => {
            setTagsError(null);
          }}
          error={tagsError || form.errors.tags}
        />
        <Checkbox
          label="Active (eligible for squad finder)"
          key={form.key("active")}
          {...form.getInputProps("active", { type: "checkbox" })}
        />
        <Group justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};
