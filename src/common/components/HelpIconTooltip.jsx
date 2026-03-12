import { Tooltip, ActionIcon } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";

export const HelpIconTooltip = ({
  tooltip,
  size = "xs",
  multiline = true,
  w = 220,
}) => {
  if (!tooltip) return null;

  return (
    <Tooltip withArrow multiline={multiline} w={w} label={tooltip}>
      <ActionIcon variant="transparent" size={size}>
        <IconHelp size="100%" />
      </ActionIcon>
    </Tooltip>
  );
};
