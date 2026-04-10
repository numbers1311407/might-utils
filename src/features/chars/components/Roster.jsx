import { Box, Button, Divider, Paper, Stack, Tabs, Text } from "@mantine/core";
import { useSearchParams } from "wouter";
import { useMemo, useState } from "react";
import { getConfirmation, useRosterStoreApi as rosterApi } from "@/model/store";
import { useRoster } from "@/core/hooks";
import {
  CharsTable,
  RosterAside,
  AddSmallButton,
  RestoreSmallButton,
  RemoveSmallButton,
  CharModalForm,
  PageTitle,
} from "@/core/components";

import { RosterTagsEditor } from "./RosterTagsEditor.jsx";

const TABS = ["characters", "tags"];

export const Roster = () => {
  const roster = useRoster();
  const [char, setChar] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return TABS.find((t) => t === tab) || TABS[0];
  }, [searchParams]);

  const onTabsChange = (tab) => {
    setSearchParams({ tab });
  };

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

      <Paper py="xl" px="md" shadow="md">
        <Tabs value={currentTab} onChange={onTabsChange} mt="-xs" mb="lg">
          <Tabs.List>
            <Tabs.Tab value="characters">Characters</Tabs.Tab>
            <Tabs.Tab value="tags">Bulk Tag Editor</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="characters" pt="lg">
            <CharsTable
              chars={roster}
              onEdit={(char) => setChar(char)}
              isRoster={true}
              onUpdate={onUpdate}
              onRemove={onRemove}
              emptyContent={
                <Stack gap="sm" py="xl">
                  <Text size="xl" c="warning">
                    You have no characters on your roster.
                  </Text>
                  <Box>
                    <Button size="compact-md" onClick={() => setChar({})}>
                      Create one now?
                    </Button>
                  </Box>
                </Stack>
              }
            />
          </Tabs.Panel>
          <Tabs.Panel value="tags">
            <RosterTagsEditor />
          </Tabs.Panel>
        </Tabs>
        <Divider />
      </Paper>

      <RosterAside visibleFrom="lg" />

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
