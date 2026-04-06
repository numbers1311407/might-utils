import { Box, NavLink, Stack, Text } from "@mantine/core";
import { Link } from "wouter";
import { usePartiesList } from "@/core/hooks";
import { IconChevronLeft } from "@tabler/icons-react";

export const PartiesNav = ({ current, ...props }) => {
  const list = usePartiesList();

  return (
    <Box {...props}>
      <Text size="lg" py={8} px={14}>
        Your Saved Parties
      </Text>
      <Stack gap={4} component="nav">
        {!list.length && (
          <Text px="md" c="dark">
            No parties exist. Create one!
          </Text>
        )}
        {list.map((record) => {
          return (
            <NavLink
              key={record.id}
              component={Link}
              active={current === record.id}
              leftSection={<IconChevronLeft size={16} />}
              label={record.name}
              href={`/parties/${record.id}`}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
