import { useState } from "react";
import { Box, Pill, Button } from "@mantine/core";
import {
  useSavedLineupsStore,
  useSavedLineupsStoreApi as storeApi,
} from "@/core/store";
import { SavedLineupModal } from "./SavedLineupModal.jsx";

export const SavedLineup = ({ record, onCopy, onEdit, onRemove }) => {
  return (
    <Box>
      <Box flex={1}>{record.name}</Box>
      <Box>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onCopy}>Copy</Button>
        <Button onClick={onRemove}>Remove</Button>
      </Box>
    </Box>
  );
};

export const SavedLineups = () => {
  const registry = useSavedLineupsStore((store) => store.registry);
  const [currentRecord, setCurrentRecord] = useState(null);

  const closeModal = () => setCurrentRecord(null);
  const onModalCommit = (record) => {
    closeModal();
    storeApi.add(record);
  };

  return (
    <Box>
      <Box>
        <Button onClick={() => setCurrentRecord({})}>Create a Party</Button>
      </Box>
      <Box>
        {Object.values(registry).map((record) => (
          <SavedLineup
            key={record.id}
            record={record}
            onEdit={() => setCurrentRecord(record)}
            onRemove={() => storeApi.remove(record)}
            onCopy={() => storeApi.copy(record)}
          />
        ))}
      </Box>

      <SavedLineupModal
        onClose={closeModal}
        onCommit={onModalCommit}
        record={currentRecord}
      />
    </Box>
  );
};
