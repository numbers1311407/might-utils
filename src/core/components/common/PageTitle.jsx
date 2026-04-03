import { Box, Divider, Group, Stack, Text, Title } from "@mantine/core";

const margins = {
  h4: "md",
  h3: "md",
  h2: 14,
  h1: 18,
};

export const PageTitle = ({
  order = 1,
  size = "h1",
  title,
  section,
  subtitle,
  children,
  divider = true,
  ...props
}) => (
  <Stack mt={margins[size] || "md"} mb="lg" {...props}>
    <Group gap={6} align="flex-start">
      <Box flex="1 0" mt={-4} c="gold">
        {typeof section === "string" && (
          <Text c="brown" pl={2} fw="bold">
            {section}
          </Text>
        )}
        {section && typeof section !== "string" && section}
        <Title order={order} size={size} my={0} fw="bold">
          {title}
        </Title>
        {typeof subtitle === "string" && (
          <Text pl={2} c="dark">
            {subtitle}
          </Text>
        )}
        {subtitle && typeof subtitle !== "string" && subtitle}
      </Box>
      {children}
    </Group>
    {divider && <Divider />}
  </Stack>
);
