import {
  Box,
  Button,
  Checkbox,
  CheckIcon,
  Radio,
  Table,
  Text,
} from "@mantine/core";
const { Tr, Tbody, Tfoot, Thead } = Table;

const borderStyle = "1px solid var(--mantine-color-default-border)";
const BorderedBox = ({ borderLeft, borderRight, ...props }) => (
  <Box
    style={{
      ...props.style,
      borderLeft: borderLeft ? borderStyle : undefined,
      borderRight: borderRight ? borderStyle : undefined,
    }}
    {...props}
  />
);

export const Td = (props) => (
  <BorderedBox h={40} component={Table.Td} {...props} />
);
export const Th = (props) => <BorderedBox component={Table.Th} {...props} />;
export { Table, Tr, Tbody, Tfoot, Thead };

// Basic check button for the select all header buttons
export const CheckButton = ({ label, ...props }) => {
  return (
    <Button size="compact-xs" leftSection={<CheckIcon size={14} />} {...props}>
      <Text size="sm">{label}</Text>
    </Button>
  );
};

export const RadioCell = ({
  notApplicable = false,
  label: _label,
  hiddenRadio,
  slot,
  value,
  ...props
}) => {
  const slotLabel = (slot) =>
    slot ? `${slot.level} ${slot.warden ? `Rk. ${slot.warden}` : ""}` : "";
  const label =
    !_label || typeof _label !== "object"
      ? `${_label || ""}${_label && slot ? " @ " : ""}${slotLabel(slot)}`
      : _label;
  return (
    <Td {...props}>
      {notApplicable ? (
        "n/a"
      ) : (
        <Radio
          styles={hiddenRadio ? { inner: { display: "none" } } : undefined}
          label={label}
          value={value}
          w="100%"
        />
      )}
    </Td>
  );
};

export const CheckboxCell = ({
  notApplicable = false,
  label,
  value,
  ...props
}) => {
  return (
    <Td {...props}>
      {notApplicable ? (
        "n/a"
      ) : (
        <Checkbox label={label} value={value} w="100%" />
      )}
    </Td>
  );
};
