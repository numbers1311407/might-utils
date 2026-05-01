import { useState } from "react";
import { ActionIcon, Box, Group, Stack, Text } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import * as titles from "@/config/constants/titles";
import {
  getConfirmation,
  useTagGroupsStore,
  useTagGroupsStoreApi as tgapi,
} from "@/model/store";
import {
  PageTitle,
  AddSmallButton,
  EditSmallButton,
  CopySmallButton,
  RemoveSmallButton,
  TagsInput,
} from "@/core/components";
import { tagSchema } from "@/model/schemas";
import { TagGroupModal } from "./TagGroupModal.jsx";

export const TagGroup = ({
  group,
  onCopy,
  onEdit,
  onRemove,
  isCleanDefault,
  onReset,
}) => {
  const [error, setError] = useState();

  const confirmedOnRemove = getConfirmation(onRemove, {
    message: "This cannot be undone",
  });

  return (
    <Stack my="lg" gap={8}>
      <Group align="flex-end">
        <Box flex={1}>
          <Text size="lg">{group.name}</Text>
        </Box>
        <Group gap="xs">
          <EditSmallButton onClick={onEdit}>Edit</EditSmallButton>
          <CopySmallButton onClick={onCopy}>Duplicate</CopySmallButton>
          {onRemove && (
            <RemoveSmallButton onClick={confirmedOnRemove}>
              Remove
            </RemoveSmallButton>
          )}
        </Group>
      </Group>
      <TagsInput
        value={group.tags}
        size="md"
        removeTag={(tag) => {
          tgapi.add({ ...group, tags: group.tags.filter((t) => t !== tag) });
        }}
        addTag={(tag) => {
          const result = tagSchema.safeParse(tag);

          if (result.success) {
            tgapi.add({ ...group, tags: [...group.tags, tag] });
          } else {
            setError(result.error.issues[0].message);
          }
        }}
        onKeyDown={() => {
          setError(null);
        }}
        error={error}
        rightSection={
          onReset && (
            <ActionIcon
              size="sm"
              disabled={isCleanDefault}
              onClick={getConfirmation(onReset, {
                message:
                  "This will reset this group to its original default state",
              })}
            >
              <IconReload size={16} />
            </ActionIcon>
          )
        }
      />
    </Stack>
  );
};

export const TagGroups = () => {
  const groups = useTagGroupsStore((store) => store.registry);
  const [currentGroup, setCurrentGroup] = useState(null);

  const closeModal = () => setCurrentGroup(null);
  const onModalCommit = (group) => {
    closeModal();
    tgapi.add(group);
  };

  return (
    <Box>
      <PageTitle
        section={titles.SETTINGS_CATEGORY}
        title={titles.TAG_GROUPS_TITLE}
        subtitle="Collections of related tags used to group generated parties in a flexible way"
      >
        <AddSmallButton iconOnly={false} onClick={() => setCurrentGroup({})}>
          Add a Tag Group
        </AddSmallButton>
      </PageTitle>
      <Box>
        {Object.values(groups).map((group) => (
          <TagGroup
            key={group.id}
            group={group}
            onEdit={() => setCurrentGroup(group)}
            onRemove={
              tgapi.isRemovable(group) ? () => tgapi.remove(group) : undefined
            }
            onReset={
              tgapi.isDefault(group)
                ? () => tgapi.resetDefault(group)
                : undefined
            }
            onCopy={() => tgapi.copy(group)}
            isCleanDefault={!tgapi.isDirtyDefault(group)}
          />
        ))}
      </Box>

      <TagGroupModal
        onClose={closeModal}
        onCommit={onModalCommit}
        group={currentGroup}
      />
    </Box>
  );
};
