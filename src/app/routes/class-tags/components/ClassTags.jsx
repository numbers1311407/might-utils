import { ActionIcon, Box, Flex, Stack, Text } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import * as titles from "@/config/constants/titles";
import { getClassName } from "@/config/chars";
import {
  getConfirmation,
  useClassTagsStore,
  useClassTagsStoreApi as ctApi,
} from "@/model/store";
import {
  ClassIcon,
  PageTitle,
  ReloadSmallButton,
  TagsInput,
} from "@/core/components";

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
        <ReloadSmallButton
          aria-label="Reset to default tags"
          onClick={() => resetTags()}
        >
          Restore Defaults
        </ReloadSmallButton>
      }
    />
  );
};

const { addClassTag, removeClassTag, resetClassTags, resetAllClassTags } =
  ctApi;

export const ClassTags = () => {
  const classTags = useClassTagsStore((store) => store.tags);

  return (
    <Box my="md">
      <PageTitle
        section={titles.SETTINGS_CATEGORY}
        title={titles.CLASS_TAGS_TITLE}
        subtitle="Default tags added to each class for the targeting during party generation"
      >
        <ReloadSmallButton
          iconOnly={false}
          onClick={getConfirmation(() => resetAllClassTags(), {
            message:
              "This will revert ALL classes to the default class tags, discarding any changes.",
          })}
        >
          Reset All to Defaults
        </ReloadSmallButton>
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
    </Box>
  );
};
