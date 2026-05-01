import { Text } from "@mantine/core";

export const CalculatorDisclaimer = (props) => (
  <Text size="sm" c="dark" px={4} {...props}>
    <Text span fw="bold">
      Warning:
    </Text>{" "}
    This data is incomplete and may be inaccurate. Most testing and data is for
    T8-10.
  </Text>
);
