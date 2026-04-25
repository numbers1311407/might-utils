import { Box, Stack, Text } from "@mantine/core";

export const ChatWindow = ({ children }) => {
  return (
    <Box
      bg="slate.8"
      c="goldenrod"
      p="md"
      size="xs"
      bd="1px solid var(--mantine-color-default-border)"
      bdrs="xs"
      component={Stack}
      gap={0}
      style={{
        fontFamily: "Roboto, Arial, sans-serif",
        boxShadow: "inset 3px 3px 8px rgba(0, 0, 0, 0.7)",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export const ChatWindowDivider = () => (
  <Box
    my={6}
    w="58%"
    style={{
      borderBottom: "1px solid var(--mantine-color-yellow-5)",
    }}
  />
);

export const ChatWindowLine = ({ children }) => {
  return <Text size="sm">{children}</Text>;
};

ChatWindow.Divider = ChatWindowDivider;
ChatWindow.Line = ChatWindowLine;
