import { Group } from "@mantine/core";
import { HelpIconTooltip } from "./HelpIconTooltip.jsx";

export const HelpLabel = ({ label, help, iconSize = "xs" }) => (
  <Group gap={3} display="inline-flex">
    <span>{label}</span>
    {help && <HelpIconTooltip size={iconSize} tooltip={help} />}
  </Group>
);
