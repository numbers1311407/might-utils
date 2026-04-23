import { Paper, Text } from "@mantine/core";
import { MinusButton, PlusButton } from "./IconButton.jsx";

const highlightStyle = {
  boxShadow: "0 0 10px 3px rgba(255, 255, 100, 0.75)",
  border: "1px solid black",
};

const baseStyle = {
  border: "1px solid black",
};

export const IncrementButtons = ({
  min = 0,
  max,
  value,
  onChange,
  highlight,
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
      style={highlight === "down" ? highlightStyle : baseStyle}
    />
    <Text px={8} flex={1} span align="center">
      {value}
    </Text>
    <PlusButton
      aria-label={`Increase ${label} by 1`}
      disabled={disabled || (max !== undefined && value >= max)}
      onClick={() => onChange?.(value + 1)}
      style={highlight === "up" ? highlightStyle : baseStyle}
    />
  </Paper>
);
