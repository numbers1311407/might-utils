import { Group, Text } from "@mantine/core";
import { useParty } from "@/core/hooks";
import {
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

  return (
    <>
      <PageTitle
        section={<Text c="var(--mantine-color-white)">Current Party:</Text>}
        divider={false}
        title={party.name}
        order={3}
        size="h2"
        mb={8}
        mt={0}
      >
        <Group gap={8}>
          <EditSmallButton onClick={onRename}>Rename</EditSmallButton>
          <CopySmallButton onClick={onCopy}>Duplicate</CopySmallButton>
          <RestoreSmallButton disabled={!onReset} onClick={onReset}>
            Roster Sync
          </RestoreSmallButton>
          <RemoveSmallButton onClick={onRemove}>Remove</RemoveSmallButton>
        </Group>
      </PageTitle>
    </>
  );
};
