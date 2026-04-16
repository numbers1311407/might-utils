import { useState } from "react";
import { Button, Group, Stack } from "@mantine/core";
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
