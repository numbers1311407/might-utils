import { Box, Button, Paper, Text } from "@mantine/core";
import { useState } from "react";
import { getConfirmation, useRosterStoreApi as rosterApi } from "@/model/store";
import { useRoster } from "@/core/hooks";
import {
  CharsTable,
  CharsAside,
  AddSmallButton,
  RestoreSmallButton,
  RemoveSmallButton,
  CharModalForm,
  PageTitle,
} from "@/core/components";

export const Roster = () => {
  const roster = useRoster();
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
      message: "This will delete all characters from the roster!",
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
        section="Team Management"
        title="Character Roster"
        subtitle="The list of all your characters, the reference for party generation and saved parties"
      >
        <RestoreSmallButton onClick={onResetRoster}>Reset</RestoreSmallButton>
        <RemoveSmallButton disabled={!roster?.length} onClick={onClearRoster}>
          Remove All
        </RemoveSmallButton>
        <AddSmallButton onClick={() => setChar({})}>
          New Character
        </AddSmallButton>
      </PageTitle>

      <Paper p="md" shadow="md">
        <CharsTable
          chars={roster}
          onEdit={(char) => setChar(char)}
          isRoster={true}
          onUpdate={onUpdate}
          onRemove={onRemove}
          emptyContent={
            <>
              <Text size="lg" mb="md">
                You have no characters on your roster.
              </Text>
              <Button size="md" onClick={() => setChar({})}>
                Create a character?
              </Button>
            </>
          }
        />
      </Paper>

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
