import { useState } from "react";
import { Box, Button, Group, Stack, Text, CheckIcon } from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";

import { TextInput } from "@/core/components";
import { partySchema } from "@/model/schemas";
import { usePartiesStoreApi as storeApi } from "@/model/store";

const formSchema = partySchema.refine(
  (record) => storeApi.nameAvailable(record),
  {
    message: "Name is already taken",
    path: ["name"],
  },
);

const focusInput = (el) => setTimeout(() => el?.focus(), 50);

export const PartyForm = ({ record, navigate, cancel, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const { data: initialValues = {} } = partySchema.safeParse(record);

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: zod4Resolver(formSchema),
  });

  const onFormSubmit = (values) => {
    onSubmit?.(values);
  };

  const onFormValidationFail = () => {
    setSubmitted(true);
  };

  if (navigate) {
    return (
      <Stack gap="sm">
        <Group align="flex-start" p="sm">
          <Box c="success">
            <CheckIcon size={32} />
          </Box>
          <Text size="md" py={6}>
            Your party has been created.
          </Text>
        </Group>
        <Group justify="flex-end">
          <Button variant="outline" onClick={cancel}>
            Close and continue
          </Button>
          <Button onClick={navigate}>View it now?</Button>
        </Group>
      </Stack>
    );
  }

  return (
    <form onSubmit={form.onSubmit(onFormSubmit, onFormValidationFail)}>
      <Stack gap="sm">
        <TextInput
          label="Name"
          ref={focusInput}
          description="Name to describe your party"
          placeholder="Enter name"
          key={form.key("name")}
          onKeyUp={() => {
            if (submitted) form.validate();
          }}
          {...form.getInputProps("name")}
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={cancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};
