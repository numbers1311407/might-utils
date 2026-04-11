import { Flex, Stack, Text, UnstyledButton, Popover } from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

export const CharTagsPopover = ({ tags, classTags }) => {
  return (
    <Popover width={220} withArrow shadow="lg" zIndex={900}>
      <Popover.Target>
        <UnstyledButton>
          <IconTag display="block" size={20} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap={4}>
          <Flex gap={4}>
            <Text size="sm" fw="bold">
              Class:
            </Text>
            <Text size="sm" c="primary">
              {classTags?.length ? (
                classTags.join(", ")
              ) : (
                <Text c="dimmed" span>
                  none
                </Text>
              )}
            </Text>
          </Flex>
          <Flex gap={4}>
            <Text size="sm" fw="bold">
              Own:
            </Text>
            <Text size="sm" c="primary">
              {tags?.length ? (
                tags.join(", ")
              ) : (
                <Text c="dimmed" span>
                  none
                </Text>
              )}
            </Text>
          </Flex>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
