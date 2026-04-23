import { Box, Stack, Text } from "@mantine/core";

export const ChatWindow = ({ children }) => {
  return (
    <Box
      bg="slate.8"
      c="goldenrod"
      p="sm"
      size="xs"
      component={Stack}
      gap={0}
      style={{ fontFamily: "Arial, Sans", maxWidth: 700 }}
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
