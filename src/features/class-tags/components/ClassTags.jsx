import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useConfirmationStore, useClassTagsStore } from "@/core/store";
import {
  AppLink,
  Aside,
  ClassIcon,
  TagsInput,
  PageTitle,
} from "@/core/components";
import { getClassName } from "@/core/chars";

export const ClassTagsClass = ({ cls, tags, addTag, removeTag, resetTags }) => {
  return (
    <TagsInput
      value={tags}
      addTag={addTag}
      removeTag={removeTag}
      size="md"
      label={
        <Flex align="center" gap="sm">
          <ClassIcon cls={cls} size={30} />
          <Text size="lg" lh={1}>
            {getClassName(cls)}
          </Text>
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
  const { getConfirmation } = useConfirmationStore();
  const classTags = useClassTagsStore((store) => store.tags);
  const addClassTag = useClassTagsStore((store) => store.addClassTag);
  const removeClassTag = useClassTagsStore((store) => store.removeClassTag);
  const resetClassTags = useClassTagsStore((store) => store.resetClassTags);
  const resetAllClassTags = useClassTagsStore(
    (store) => store.resetAllClassTags,
  );

  return (
    <Box my="md">
      <PageTitle
        title="Class Tags"
        subtitle="Default tags added to each class for the purpose of the party finder."
      >
        <Button
          onClick={getConfirmation(() => resetAllClassTags(), {
            message:
              "This will revert ALL classes to the default class tags, discarding any changes.",
          })}
          rightSection={<IconReload />}
          size="xs"
        >
          Reset All to Defaults
        </Button>
      </PageTitle>
      <Stack gap="lg">
        {Object.entries(classTags).map(([cls, tags]) => (
          <ClassTagsClass
            key={cls}
            cls={cls}
            tags={tags}
            addTag={(tag) => addClassTag(cls, tag)}
            removeTag={(tag) => removeClassTag(cls, tag)}
            resetTags={getConfirmation(() => resetClassTags(cls), {
              message:
                "This will revert to the default class tags, discarding any changes.",
            })}
          />
        ))}
      </Stack>
      <Aside>
        <Stack>
          <Title order={4} c="gold">
            Quick Help
          </Title>
          <Text size="md">
            Class tags are a convenient way to manage tags common to all
            characters of the same class. E.g. in most cases every warrior is a
            "tank" and every cleric is a "healer".
          </Text>
          <Text size="md">
            When creating a <AppLink href="/parties">saved party</AppLink>, the
            class tags are snapshotted on creation, making them editable
            independent of this list.
          </Text>
          <Text>
            Roster characters always draw from these tags. Party characters can
            reset to a fresh snapshot of their roster character tags at any
            time.
          </Text>
        </Stack>
      </Aside>
    </Box>
  );
};
