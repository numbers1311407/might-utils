import { Box, NavLink, Stack, Text, Title } from "@mantine/core";
import { Link, useRoute } from "wouter";
import { usePartiesList } from "@/core/hooks";
import { IconChevronLeft } from "@tabler/icons-react";

export const PartiesNav = (props) => {
  const list = usePartiesList();
  const [_match, { id: partyId }] = useRoute("/parties/:id?");

  return (
    <Box {...props}>
      <Title order={5} pb="sm" c="primary">
        Your Parties
      </Title>
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
              active={partyId === record.id}
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
