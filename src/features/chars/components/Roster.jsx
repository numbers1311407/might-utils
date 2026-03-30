import { Anchor, Box, Button, Group, Title, Text } from "@mantine/core";
import { useState } from "react";
import {
  useConfirmationStore,
  useRoster,
  useRosterStoreApi as rosterApi,
} from "@/core/store";
import {
  CharsTable,
  CharsAside,
  CharModalForm,
  PageTitle,
} from "@/core/components";

export const Roster = () => {
  const { roster } = useRoster();
  const { getConfirmation } = useConfirmationStore();
  const [char, setChar] = useState(null);

  const onResetRoster = getConfirmation(
    () => {
      rosterApi.resetRoster();
    },
    {
      message:
        "This will reset the roster back to the initial example roster, " +
        "removing any characters you may have added.",
    },
  );

  const onClearRoster = getConfirmation(
    () => {
      rosterApi.clearRoster();
    },
    {
      message: "This will clear all characters from the roster!",
    },
  );

  const onRemove = getConfirmation(
    (char) => {
      rosterApi.removeChar(char);
    },
    {
      title: "Are you sure you want to remove this character?",
      message:
        "Any saved parties this character is a member of will be removed.",
    },
  );

  const onUpdate = (id, char) => {
    rosterApi.updateChar(id, char);
  };

  return (
    <Box>
      <PageTitle
        buttons={
          <>
            <Button size="xs" onClick={() => setChar({})}>
              New Character
            </Button>
            <Button variant="light" size="xs" onClick={onResetRoster}>
              Reset
            </Button>
            <Button
              variant="light"
              size="xs"
              disabled={!roster?.length}
              onClick={onClearRoster}
            >
              Clear
            </Button>
          </>
        }
      >
        Character Roster
      </PageTitle>

      <CharsTable
        chars={roster}
        onEdit={(char) => setChar(char)}
        isRoster={true}
        onUpdate={onUpdate}
        onRemove={onRemove}
        emptyContent={
          <>
            <Text>You have no characters on your roster.</Text>
            <Anchor onClick={() => setChar({})}>Create a new character?</Anchor>
          </>
        }
      />

      <CharsAside visibleFrom="lg" chars={roster} isRoster />

      <CharModalForm
        char={char}
        onSubmit={(char) => {
          rosterApi.addChar(char, () => setChar(null));
        }}
        onClose={() => setChar(null)}
      />
    </Box>
  );
};
