import { useState } from "react";
import { CloseButton, Button, Modal, TextInput, Group } from "@mantine/core";
import { useTagRulesStoreApi } from "@/common/tags/store";

const { nameAvailable } = useTagRulesStoreApi;

export const TagRulesNameModal = ({ ruleset, onClose, onCommit }) => {
  const [name, setName] = useState(ruleset?.name || "");
  const [error, setError] = useState(false);
  const [dirty, setDirty] = useState(false);

  const onSubmit = () => {
    if (validate()) {
      onCommit?.({ ...ruleset, name });
    }
  };

  const validate = () => {
    if (!name.trim()) {
      handleError("Cannot be blank");
      return false;
    } else if (ruleset?.name !== name && !nameAvailable(name)) {
      handleError("Name is taken");
      return false;
    }
    setError(false);
    return true;
  };

  const handleError = (msg) => {
    setDirty(true);
    setError(msg);
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
        placeholder="I make the rules"
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
