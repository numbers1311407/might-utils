import { Group, Title } from "@mantine/core";

export const PageTitle = ({ children, buttons }) => (
  <Group gap={4} align="center">
    <Title order={2} size="h2" my="sm" flex={1}>
      {children}
    </Title>
    {buttons}
  </Group>
);
