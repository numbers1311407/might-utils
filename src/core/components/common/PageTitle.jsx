import { Box, Group, Text, Title } from "@mantine/core";

export const PageTitle = ({
  order = 2,
  size = "h2",
  title,
  subtitle,
  children,
  ...props
}) => (
  <Group gap={6} align="flex-start" my="md" {...props}>
    <Box flex="1 0" mt={-4}>
      <Title order={order} size={size} my={0}>
        {title}
      </Title>
      {subtitle && (
        <Text pl={2} color="dark">
          {subtitle}
        </Text>
      )}
    </Box>
    {children}
  </Group>
);
