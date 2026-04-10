import { useState } from "react";
import { CloseButton, Button, Modal, TextInput, Group } from "@mantine/core";
import { useTagRulesStoreApi } from "@/model/store";
import { tagRulesetSchema } from "@/model/schemas";

const { nameAvailable } = useTagRulesStoreApi;

const formSchema = tagRulesetSchema.refine(
  (ruleset) => nameAvailable(ruleset),
  {
    message: "Name already taken",
    path: ["name"],
  },
);

export const TagRulesNameModal = ({ ruleset, onClose, onCommit }) => {
  const [name, setName] = useState(ruleset.name || "");
  const [error, setError] = useState(false);
  const [dirty, setDirty] = useState(false);

  const onSubmit = () => {
    if (validate()) {
      onCommit?.({ ...ruleset, name });
    }
  };

  const validate = () => {
    const result = formSchema.safeParse({ ...ruleset, name });
    setError(result.success ? false : result.error.issues[0].message);
    if (!result.success) {
      setDirty(true);
    }
    return result.success;
  };

  const clear = () => {
    setName("");
    setError(false);
  };

  return (
    <Modal
      opened={!!ruleset}
      onClose={onClose}
      title={ruleset?.id ? "Edit Ruleset Name" : "New Ruleset"}
    >
      <TextInput
        value={name}
        label="Ruleset Name"
        placeholder="Enter a name for your new ruleset"
        error={error}
        rightSection={<CloseButton onClick={clear} />}
        onChange={(e) => {
          setName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        onKeyUp={() => {
          if (dirty) validate();
        }}
      />
      <Group my="xs" gap="xs" justify="flex-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </Group>
    </Modal>
  );
};
