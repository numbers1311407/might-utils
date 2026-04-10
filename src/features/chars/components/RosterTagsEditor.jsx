import { CloseButton, Flex, Stack, Text } from "@mantine/core";
import { useRosterCharApi, useRoster } from "@/core/hooks";
import { ClassIcon, TagsInput } from "@/core/components";
import { getClassName } from "@/config/chars";

export const RosterTagsEditorField = ({ charId }) => {
  const { char, tags, classTags, ...api } = useRosterCharApi(charId);

  return (
    <TagsInput
      value={tags}
      addTag={api.addTags}
      lockedTags={classTags}
      removeTag={api.removeTags}
      size="md"
      label={
        <Flex align="center" gap="sm">
          <ClassIcon cls={char.class} size={30} />
          <Text size="md" lh={1}>
            {char.name} - {char.level} {getClassName(char.class)}
          </Text>
        </Flex>
      }
      rightSection={
        <CloseButton
          size="sm"
          aria-label="Clear all personal tags"
          onClick={() => api.clearTags()}
        />
      }
    />
  );
};

export const RosterTagsEditor = () => {
  const roster = useRoster();

  return (
    <Stack py="xl" px="sm" gap="md">
      {roster.map(({ id }) => (
        <RosterTagsEditorField key={id} charId={id} />
      ))}
    </Stack>
  );
};
