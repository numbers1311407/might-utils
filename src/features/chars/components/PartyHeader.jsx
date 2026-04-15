import { Box, Group, Text } from "@mantine/core";
import { useMemo } from "react";
import { useParty } from "@/core/hooks";
import { usePartiesStoreApi as partiesApi } from "@/model/store";
import {
  CharSelect,
  PageTitle,
  EditSmallButton,
  RemoveSmallButton,
  RestoreSmallButton,
  CopySmallButton,
} from "@/core/components";

export const PartyHeader = ({
  partyId,
  onCopy,
  onRemove,
  onReset,
  onRename,
}) => {
  const { party } = useParty(partyId);

  const partyNames = useMemo(
    () => party.chars?.map((char) => char.name),
    [party],
  );

  return (
    <>
      <PageTitle
        section={<Text c="var(--mantine-color-white)">Current Party</Text>}
        divider={false}
        title={party.name}
        order={3}
        size="h2"
        mb={8}
        mt={8}
      >
        <CharSelect
          label={<Box>Add a Character</Box>}
          emits="char"
          size="md"
          styles={{
            root: {
              display: "flex",
              alignItems: "center",
              gap: 12,
            },
          }}
          exclude={partyNames}
          onChange={(char) => {
            partiesApi.addChar(party.id, char.name);
          }}
        />
      </PageTitle>
      <Group>
        <Group gap={8} my="sm">
          <EditSmallButton onClick={onRename}>Rename</EditSmallButton>
          <CopySmallButton onClick={onCopy}>Duplicate</CopySmallButton>
          <RestoreSmallButton disabled={!onReset} onClick={onReset}>
            Roster Sync
          </RestoreSmallButton>
          <RemoveSmallButton onClick={onRemove}>Remove</RemoveSmallButton>
        </Group>
      </Group>
    </>
  );
};
