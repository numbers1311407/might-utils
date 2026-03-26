import { useState } from "react";
import { Box, Pill, Button, Title } from "@mantine/core";
import { useTagGroupsStore, useTagGroupsStoreApi as tgapi } from "@/core/store";
import { TagGroupModal } from "./TagGroupModal.jsx";

export const TagGroup = ({
  group,
  onCopy,
  onEdit,
  onRemove,
  isCleanDefault,
  onReset,
}) => {
  return (
    <Box>
      <Box flex={1}>{group.name}</Box>
      <Box>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onCopy}>Copy</Button>
        {onReset && (
          <Button disabled={isCleanDefault} onClick={onReset}>
            Reset
          </Button>
        )}
        {onRemove && <Button onClick={onRemove}>Remove</Button>}
      </Box>
      <Box>
        {group.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </Box>
    </Box>
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
      <Title order={2} mb="xs">
        Tag Groups
      </Title>
      <Box>
        <Button onClick={() => setCurrentGroup({})}>New Group</Button>
      </Box>
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
