import { Paper, Text } from "@mantine/core";
import { MinusButton, PlusButton } from "./IconButton.jsx";

export const IncrementButtons = ({
  min = 0,
  max,
  value,
  onChange,
  disabled = false,
  label = "value",
}) => (
  <Paper
    display="inline-flex"
    withBorder
    px={2}
    py={1}
    shadow="xs"
    style={{
      alignItems: "center",
      borderRadius: 4,
      wrap: "nowrap",
      gap: 0,
    }}
  >
    <MinusButton
      aria-label={`Reduce ${label} by 1`}
      disabled={disabled || (min !== undefined && value <= min)}
      onClick={() => onChange?.(value - 1)}
    />
    <Text px={8} flex={1} span align="center">
      {value}
    </Text>
    <PlusButton
      aria-label={`Increase ${label} by 1`}
      disabled={disabled || (max !== undefined && value >= max)}
      onClick={() => onChange?.(value + 1)}
    />
  </Paper>
);
