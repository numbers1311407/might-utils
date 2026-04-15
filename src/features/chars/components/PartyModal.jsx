import { useState } from "react";
import { Button, Group, Modal, Stack } from "@mantine/core";
import { TextInput } from "@/core/components";
import { useForm } from "@mantine/form";
import { usePartiesStoreApi as storeApi } from "@/model/store";
import { partySchema } from "@/model/schemas";
import { zod4Resolver } from "mantine-form-zod-resolver";

const formSchema = partySchema.refine(
  (record) => storeApi.nameAvailable(record),
  {
    message: "Name is already taken",
    path: ["name"],
  },
);

export const PartyForm = ({ record, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: partySchema.partial().parse(record),
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
          onKeyUp={() => {
            if (submitted) form.validate();
          }}
          {...form.getInputProps("name")}
        />
        <Group justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

export const PartyModal = ({ record, onClose, onSubmit }) => {
  return (
    <Modal
      opened={!!record}
      onClose={() => onClose?.()}
      closeOnClickOutside={false}
      title={record?.id ? `Edit Party: ${record.name}` : "New Party"}
    >
      {record && (
        <PartyForm
          // note this key hack is to get around mantine's aggressive form caching
          key={record ? "opened" : "closed"}
          record={record}
          onSubmit={(record) => {
            onSubmit?.(record);
            onClose?.();
          }}
        />
      )}
    </Modal>
  );
};
