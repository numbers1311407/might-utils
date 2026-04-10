import { useState } from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTagGroupsStoreApi as tgapi } from "@/model/store";
import { tagSchema, tagGroupSchema } from "@/model/schemas";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { HelpLabel, TagsInput } from "@/core/components";

const formSchema = tagGroupSchema
  .safeExtend({})
  .refine((group) => tgapi.nameAvailable(group), {
    message: "Name is already taken",
    path: ["name"],
  });

const tagsHelp =
  "In party searches, individual characters may be grouped by these tags. For this to be " +
  "possible, all characters must have one of these tags, either directly assigned or defaulting " +
  "from their class tags. Tags can contain letters, numbers, and hyphens.";

export const TagGroupForm = ({ group, onSubmit }) => {
  const [tagsError, setTagsError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: tagGroupSchema.partial().parse(group),
    validate: zod4Resolver(formSchema),
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
      // if submitted and failed, get more aggressive about validation
      if (submitted) form.validateField("tags");
    }
  };

  const removeTag = (tag) => {
    tag = tag.toLowerCase();
    const tags = form.getValues()?.tags || [];
    const idx = tags.indexOf(tag);
    if (idx !== -1) {
      form.removeListItem("tags", idx);
      if (submitted) form.validateField("tags");
    }
  };

  const onFormSubmit = (values) => {
    onSubmit?.(values);
  };

  const onFormValidationFail = () => {
    setSubmitted(true);
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit, onFormValidationFail)}>
      <Stack gap={6}>
        <TextInput
          label="Name"
          description="Name which will appear in the grouping dropdown"
          placeholder="Enter name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TagsInput
          label={<HelpLabel label="Tags" help={tagsHelp} />}
          description="Enter a tag followed by space or enter"
          removeTag={removeTag}
          addTag={addTag}
          key={form.key("tags")}
          // NOTE This input does not accept onChange, rather addTag and removeTag
          // combined manage the tag state
          {...form.getInputProps("tags")}
          onKeyDown={() => {
            setTagsError(null);
          }}
          error={tagsError || form.errors.tags}
        />
        <Group justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

export const TagGroupModal = ({ group, onClose, onCommit }) => {
  return (
    <Modal
      opened={!!group}
      onClose={() => onClose?.()}
      closeOnClickOutside={false}
      title={group?.id ? `Edit Tag Group: ${group.name}` : "New Tag Group"}
    >
      {group && (
        <TagGroupForm
          // note this key hack is to get around mantine's aggressive form caching
          key={!!group ? "opened" : "closed"}
          group={group}
          onSubmit={(group) => {
            onCommit?.(group);
            onClose?.();
          }}
        />
      )}
    </Modal>
  );
};
