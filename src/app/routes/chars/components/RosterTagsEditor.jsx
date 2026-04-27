import {
  Alert,
  Button,
  CloseButton,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { Link } from "wouter";
import { useRosterCharApi, useRoster } from "@/core/hooks";
import { AppLink, ClassIcon, TagsInput } from "@/core/components";
import { getClassName } from "@/config/chars";

export const RosterTagsEditorField = ({ name }) => {
  const { char, tags, classTags, ...api } = useRosterCharApi(name);

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

export const RosterTagsEditor = ({ setChar }) => {
  const roster = useRoster();

  return (
    <Stack py="xl" px="sm" gap="md">
      <Alert size="sm" variant="info">
        <Stack gap="xs">
          <Text>
            On this tab you can set tags for all the characters in your roster.
            Just type a tag and press space or enter, they will save
            immediately.
          </Text>
          <Text>
            The uneditable tags are common class tags, which you can{" "}
            <AppLink href="/class-tags">edit here</AppLink>.
          </Text>
        </Stack>
      </Alert>
      {!roster.length && (
        <Stack gap="sm" py="xl" align="center">
          <Text size="xl" c="warning">
            You have no characters on your roster.
          </Text>
          <Group>
            {setChar && (
              <>
                <Button size="compact-md" onClick={() => setChar({})}>
                  Create one now?
                </Button>
                <Text span fw="bold">
                  or
                </Text>
              </>
            )}
            <Button component={Link} size="compact-md" href="/roster/io">
              Import a list?
            </Button>
          </Group>
        </Stack>
      )}
      {roster.map(({ name }) => (
        <RosterTagsEditorField key={name} name={name} />
      ))}
    </Stack>
  );
};
