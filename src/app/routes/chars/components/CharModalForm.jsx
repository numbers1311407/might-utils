import {
  Button,
  Box,
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
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";

import { CLASS_SHORTNAMES } from "@/config";
import { capitalize } from "@/utils";
import { TagsInput } from "@/core/tags";
import { extendCharSchema, charClassSchema, tagSchema } from "@/model/schemas";
import { useClassTagsStore, useRosterStore } from "@/model/store";
import { MightMinLevel, MightMaxLevel } from "@/config/might";

const formCharSchema = extendCharSchema((schema) =>
  schema
    .extend({
      siblings: z.array(z.string()),
    })
    .refine(
      ({ name, siblings }) => !name || !siblings.includes(capitalize(name)),
      {
        message: "Character name is already taken",
        path: ["name"],
      },
    ),
);

export const CharModalForm = ({ char, onClose, onSubmit }) => {
  return (
    <Modal
      opened={!!char}
      onClose={onClose}
      closeOnClickOutside={false}
      title={char?.name ? `Edit Character: ${char.name}` : "New Character"}
    >
      {char && (
        <CharForm
          // note this key hack is to get around mantine's aggressive form caching
          key={char ? "opened" : "closed"}
          char={char}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

const CharForm = ({ char, onClose, onSubmit }) => {
  const roster = useRosterStore((store) => store.roster);
  const classTags = useClassTagsStore((store) => store.tags);
  const [tagsError, setTagsError] = useState(null);
  const charClass = char.class || charClassSchema.options[0];
  const charClassTags = classTags[charClass] || [];
  const initialValues = {
    name: char.name || "",
    level: char.level || 65,
    active: char.active ?? true,
    class: charClass,
    warden: String(char.warden || 0),
    tags: char.tags || [],
    siblings: roster
      .map(({ name }) => name)
      .filter((name) => !char || char.name !== name),
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    transformValues: (values) => {
      const { siblings: _, ...restValues } = values;
      return {
        ...restValues,
        // Characters don't have IDs to make it trivial to attach them to parties
        // and to keep the import/export process simpler, but this does create one
        // problem: renaming. The roster store addesses this by allowing a _name
        // attribute which is used as the primary key during add/update, which is
        // used to look up the character while also allowing normal `name` to be
        // sent in the update object.
        _name: initialValues.name,
        warden: Number(values.warden),
      };
    },
    validate: zod4Resolver(formCharSchema),
  });

  // Display "locked" tags which will be inherited from the character class  tags and
  // are unnecessary to add to characters separately. In the form these tags appear in
  // the field but aren't editable, and will prevent duplicates being added. On class
  // change we reset the class tags and strip any duplicates, which shouldn't be a big deal?
  const [lockedTags, setLockedTags] = useState(charClassTags);

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
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <Select
          withAsterisk
          label="Class"
          placeholder="Select class"
          searchable
          data={CLASS_SHORTNAMES}
          key={form.key("class")}
          {...form.getInputProps("class")}
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
          label="Max Warden Rank"
          placeholder="Max warden rank earned"
          data={[
            { label: "Rank 0 (Unwardened)", value: "0" },
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
        <Box my="sm">
          <Checkbox
            label="Active (eligible for party finder)"
            key={form.key("active")}
            {...form.getInputProps("active", { type: "checkbox" })}
          />
        </Box>
        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};
