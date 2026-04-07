import { Tooltip, ActionIcon } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";

export const HelpIconTooltip = ({
  tooltip,
  size = "xs",
  multiline = true,
  w = 220,
  ...iconProps
}) => {
  if (!tooltip) return null;

  return (
    <Tooltip withArrow multiline={multiline} w={w} label={tooltip}>
      <ActionIcon
        variant="transparent"
        size={size}
        tabIndex={-1}
        {...iconProps}
      >
        <IconHelp size="100%" />
      </ActionIcon>
    </Tooltip>
  );
};
