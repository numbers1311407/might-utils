import { useState } from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSavedLineupsStoreApi as storeApi } from "@/core/store";
import { tagSchema, lineupSchema } from "@/core/schemas";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { HelpLabel, TagsInput } from "@/core/components";

const formSchema = lineupSchema
  .safeExtend({})
  .refine((record) => storeApi.nameAvailable(record), {
    message: "Name is already taken",
    path: ["name"],
  });

export const SavedLineupForm = ({ record, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: lineupSchema.partial().parse(record),
    validate: zod4Resolver(formSchema),
  });

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
          description="Name to describe your party"
          placeholder="Enter name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <Group justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

export const SavedLineupModal = ({ record, onClose, onCommit }) => {
  return (
    <Modal
      opened={!!record}
      onClose={() => onClose?.()}
      closeOnClickOutside={false}
      title={record?.id ? `Edit Party: ${record.name}` : "New Party"}
    >
      {record && (
        <SavedLineupForm
          // note this key hack is to get around mantine's aggressive form caching
          key={!!record ? "opened" : "closed"}
          record={record}
          onSubmit={(record) => {
            onCommit?.(record);
            onClose?.();
          }}
        />
      )}
    </Modal>
  );
};
