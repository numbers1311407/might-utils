import { useState } from "react";
import { Box, Pill, Button } from "@mantine/core";
import { useTagGroupsStore, useTagGroupsStoreApi as tgapi } from "@/core/store";
import { PageTitle } from "@/core/components";
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
      <PageTitle
        section="Configuration"
        title="Generator Result Groups"
        subtitle="Collections of related tags used to group generated parties in a flexible way"
      >
        <Button size="sm" onClick={() => setCurrentGroup({})}>
          Create a New Tag Group
        </Button>
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
