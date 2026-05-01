import { Box, Divider, Group, Stack, Text, Title } from "@mantine/core";

const margins = {
  h4: "md",
  h3: "md",
  h2: 14,
  h1: 18,
};

const Subtitle = ({ children: subtitle, ...props }) => {
  if (!subtitle) return null;

  return (
    <Stack {...props}>
      {typeof subtitle === "string" && (
        <Text pl={2} c="dark">
          {subtitle}
        </Text>
      )}
      {subtitle && typeof subtitle !== "string" && subtitle}
    </Stack>
  );
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
  <Stack mt={margins[size] || "md"} mb="md" {...props}>
    <Stack gap={0}>
      <Group gap={6} align="flex-start">
        <Box
          mb={{ base: 4, lg: 0 }}
          flex={{ base: "1 0 100%", lg: "1 0 auto" }}
          c="primary"
        >
          {typeof section === "string" && (
            <Text c="primary-heading" pl={2} fw="bold">
              {section}
            </Text>
          )}
          {section && typeof section !== "string" && section}
          <Title order={order} size={size} my={0} fw="bold">
            {title}
          </Title>
          <Subtitle hiddenFrom="lg">{subtitle}</Subtitle>
        </Box>
        {children}
      </Group>
      <Subtitle visibleFrom="lg">{subtitle}</Subtitle>
    </Stack>
    {divider && <Divider />}
  </Stack>
);
