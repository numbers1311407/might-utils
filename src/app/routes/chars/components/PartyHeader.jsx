import { Button, Group, Text } from "@mantine/core";
import { useParty } from "@/core/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  AppLink,
  PageTitle,
  EditSmallButton,
  RemoveSmallButton,
  RestoreSmallButton,
  CopySmallButton,
} from "@/core/components";

const BackButton = () => (
  <Button
    component={AppLink}
    underline="never"
    leftSection={<IconArrowLeft />}
    size="compact-md"
    variant="subtle"
    href="/parties"
    display="inline-flex"
    mb={8}
    ml={-8}
  >
    Back to Party Index
  </Button>
);

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
        section={
          <>
            <BackButton />
            <Group gap="xs">
              <Text
                size="md"
                fw="bold"
                c="var(--mantine-color-primary-heading-text)"
              >
                Party Building
              </Text>
              <Text size="sm" fw="bold" c="dimmed">
                &gt;
              </Text>
              <Text
                size="md"
                fw="bold"
                c="var(--mantine-color-primary-heading-text)"
              >
                Viewing Party
              </Text>
            </Group>
          </>
        }
        title={party.name}
      >
        <Group gap={8}>
          <EditSmallButton iconOnly={false} onClick={onRename}>
            Rename
          </EditSmallButton>
          <CopySmallButton iconOnly={false} onClick={onCopy}>
            Duplicate
          </CopySmallButton>
          <RestoreSmallButton
            iconOnly={false}
            disabled={!onReset}
            onClick={onReset}
          >
            Sync to Roster
          </RestoreSmallButton>
          <RemoveSmallButton onClick={onRemove}>Remove</RemoveSmallButton>
        </Group>
      </PageTitle>
    </>
  );
};
