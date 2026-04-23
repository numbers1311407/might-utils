import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import * as titles from "@/config/constants/titles";
import { useRoute, useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { getConfirmation, useRosterStoreApi as rosterApi } from "@/model/store";
import { useRoster } from "@/core/hooks";
import {
  AddSmallButton,
  RestoreSmallButton,
  RemoveSmallButton,
  PageTitle,
} from "@/core/components";

import { CharsTable } from "@/core/chars";

import { CharModalForm } from "./CharModalForm.jsx";
import { RosterAside } from "./RosterAside.jsx";
import { RosterTagsEditor } from "./RosterTagsEditor.jsx";
import { RosterImporter } from "./RosterImporter.jsx";

const TABS = ["characters", "tags", "io"];

export const Roster = () => {
  const roster = useRoster();
  const [char, setChar] = useState(null);
  const [_location, setLocation] = useLocation();
  const [_match, params] = useRoute("/roster/:tab?");
  const currentTab = params?.tab || "characters";
  const onTabsChange = (tab) => {
    setLocation(`/roster/${tab}`);
  };

  useEffect(() => {
    if (!params?.tab) {
      setLocation("/roster/characters");
    }
  }, [params?.tab, setLocation]);

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

  const onUpdate = (name, char) => {
    rosterApi.updateChar(name, char);
  };

  return (
    <Box>
      <PageTitle
        section={titles.ROSTER_CATEGORY}
        title={titles.ROSTER_TITLE}
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

      <RosterAside visibleFrom="lg" />

      <Paper py="xl" px="md" shadow="md">
        <Tabs value={currentTab} onChange={onTabsChange} mt="-xs">
          <Tabs.List>
            <Tabs.Tab value="characters">Character List</Tabs.Tab>
            <Tabs.Tab value="tags">Bulk Tag Editor</Tabs.Tab>
            <Tabs.Tab value="io">Import/Export</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="characters" pt="lg">
            {currentTab === "characters" && (
              <>
                <CharsTable
                  activeStar
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
                      <Group justify="center">
                        <Button size="compact-md" onClick={() => setChar({})}>
                          Create one now?
                        </Button>
                        <Text span fw="bold">
                          or
                        </Text>
                        <Button
                          component={Link}
                          size="compact-md"
                          href="/roster?tab=io"
                        >
                          Import a list?
                        </Button>
                      </Group>
                    </Stack>
                  }
                />
                <Divider />
                <Text c="dark" mt="xs" pos="relative">
                  <Text span c="primary" size="xl">
                    *
                  </Text>{" "}
                  Only{" "}
                  <Text span fw="bold" c="primary">
                    active
                  </Text>{" "}
                  characters will be considered as eligible for the party
                  generator.
                </Text>
              </>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="tags">
            {currentTab === "tags" && <RosterTagsEditor />}
          </Tabs.Panel>
          <Tabs.Panel value="io">
            {currentTab === "io" && <RosterImporter />}
          </Tabs.Panel>
        </Tabs>
      </Paper>

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
