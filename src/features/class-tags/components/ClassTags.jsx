import { ActionIcon, Box, Button, Flex, Stack } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useClassTagsStore } from "@/core/store";
import { ClassIcon, TagsInput } from "@/core/components";

export const ClassTagsClass = ({ cls, tags, addTag, removeTag, resetTags }) => {
  return (
    <TagsInput
      value={tags}
      addTag={addTag}
      removeTag={removeTag}
      label={
        <Flex align="center" gap="xs">
          <ClassIcon cls={cls} size={20} />
          {cls}
        </Flex>
      }
      rightSection={
        <ActionIcon
          aria-label="Reset to default tags"
          title="Reset to default tags"
          onClick={() => resetTags()}
        >
          <IconReload />
        </ActionIcon>
      }
    />
  );
};

export const ClassTags = () => {
  const classTags = useClassTagsStore((store) => store.tags);
  const addClassTag = useClassTagsStore((store) => store.addClassTag);
  const removeClassTag = useClassTagsStore((store) => store.removeClassTag);
  const resetClassTags = useClassTagsStore((store) => store.resetClassTags);
  const resetAllClassTags = useClassTagsStore(
    (store) => store.resetAllClassTags,
  );

  return (
    <Box my="md" style={{ maxWidth: 1200 }}>
      <Box mb="sm">
        Class tags are default tags added to each class, useful for filtering
        group composition results using tag based rules. Enter tags into each
        text field and press enter to add new tags, or click the X on existing
        tags to remove them.
      </Box>
      <Flex gap="xs" align="center" my="md" justify="flex-end">
        <Button
          onClick={() => resetAllClassTags()}
          rightSection={<IconReload />}
          size="xs"
        >
          Reset All to Defaults
        </Button>
      </Flex>
      <Stack border="1px solid blue">
        {Object.entries(classTags).map(([cls, tags]) => (
          <ClassTagsClass
            key={cls}
            cls={cls}
            tags={tags}
            addTag={(tag) => addClassTag(cls, tag)}
            removeTag={(tag) => removeClassTag(cls, tag)}
            resetTags={() => resetClassTags(cls)}
          />
        ))}
      </Stack>
    </Box>
  );
};
