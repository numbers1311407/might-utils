import { useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Pill,
  PillsInput,
  Stack,
} from "@mantine/core";
import { ClassIcon } from "@/common/components/ClassIcon.jsx";
import { useClassTagsStore } from "@/common/tags/store";
import { IconReload } from "@tabler/icons-react";

export const ClassTagsClass = ({ cls, tags, addTag, removeTag, resetTags }) => {
  const [value, setValue] = useState("");
  const tagPills = tags.map((tag) => (
    <Pill key={tag} withRemoveButton onRemove={() => removeTag(tag)}>
      {tag}
    </Pill>
  ));

  return (
    <Flex>
      <PillsInput
        flex={1}
        label={
          <Flex align="center" gap="xs">
            <ClassIcon cls={cls} height="20px" width="20px" />
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
      >
        <Pill.Group>
          {tagPills}
          <PillsInput.Field
            value={value}
            placeholder="Add tag"
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Backspace" &&
                value.length === 0 &&
                tagPills.length > 0
              ) {
                e.preventDefault();
                removeTag(tags[tags.length - 1]);
              } else if (
                (e.key === "Enter" || e.code === "Space") &&
                value.length > 0
              ) {
                e.preventDefault();
                addTag(value);
                setValue("");
              } else if (e.code === "Space") {
                e.preventDefault();
              }
            }}
          />
        </Pill.Group>
      </PillsInput>
    </Flex>
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
      <Box mb="md">
        <strong>Note:</strong> When grouping results by tag, each character must
        possess only one of the tag groups. Keep this in mind when tagging and
        deciding how you want results to be grouped. For example, rangers may be
        considered both "rdps" and "mdps", however if you want to group on those
        tags, you must adjust ranger to be tagged with just one, depending on
        how you have it specced.
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
