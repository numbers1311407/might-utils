import { useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import {
  useConfirmationStore,
  useTagGroupsStore,
  useTagGroupsStoreApi as tgapi,
} from "@/core/store";
import { Aside, PageTitle, TagsInput } from "@/core/components";
import { tagSchema } from "@/core/schemas";
import { TagGroupModal } from "./TagGroupModal.jsx";

export const TagGroup = ({
  group,
  onCopy,
  onEdit,
  onRemove,
  isCleanDefault,
  onReset,
}) => {
  const { getConfirmation } = useConfirmationStore();
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
        <Group gap={4}>
          <Button size="compact-sm" onClick={onEdit}>
            Edit
          </Button>
          <Button size="compact-sm" onClick={onCopy}>
            Duplicate
          </Button>
          {onRemove && (
            <Button
              variant="outline"
              size="compact-sm"
              onClick={confirmedOnRemove}
            >
              Remove
            </Button>
          )}
        </Group>
      </Group>
      <TagsInput
        value={group.tags}
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
        section="Configuration"
        title="Generator Grouping Tags"
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

      <Aside>
        <Stack>
          <Title c="gold" order={4}>
            Quick Help
          </Title>
          <Text>
            Generator grouping tags are what they sound like, tags which results
            may be grouped by in the party generator.
          </Text>
          <Text>
            They can be any tags you like, with the only rule being that
            everyone in the roster has to have one of them, so they can be
            grouped.
          </Text>
          <Text>
            When you select a group in the dropdown nav of the party finder,
            resulting parties will be grouped in buckets per tag, and all the
            results sharing the same configuration will be grouped together.
          </Text>
          <Text>
            If a character has more than one tag, the grouping behavior will be
            defined by the "Distinct Tag Group" checkbox. With distinct, the
            character will be represented uniquely for 1 tag at time in the
            results, otherwise, they will be treated as having every tag.
          </Text>
        </Stack>
      </Aside>
    </Box>
  );
};
