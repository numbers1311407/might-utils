import {
  alpha,
  Box,
  Group,
  Paper,
  Portal,
  CloseButton,
  ScrollArea,
  Text,
} from "@mantine/core";
import { HelpIconTooltip } from "@/core/components/common";
import { usePersistedFloatingWindow } from "@/core/hooks";
import { IconGripVertical } from "@tabler/icons-react";

const DEFAULT_Z_INDEX = 400;

export const FloatingWindow = ({
  children,
  help,
  name,
  title,
  initialPosition = "auto",
  ...paperProps
}) => {
  if (!name) {
    throw new Error("Floating window requires a name for persistence");
  }

  const { ref, ...floatingWindow } = usePersistedFloatingWindow(name, {
    initialPosition,
    dragHandleSelector: ".drag-handle",
    excludeDragHandleSelector: ".close-btn",
  });

  const { zIndex = DEFAULT_Z_INDEX } = floatingWindow;

  return (
    <>
      {floatingWindow.opened && (
        <Portal>
          <Paper
            {...paperProps}
            bd={`1px solid ${alpha("var(--mantine-color-primary-8)", 0.25)}`}
            onMouseDown={() => floatingWindow.raise()}
            pos="fixed"
            ref={ref}
            shadow={floatingWindow.isDragging ? "md" : "sm"}
            style={{ transition: "box-shadow 70ms ease", zIndex }}
          >
            <Group
              className="drag-handle"
              justify="space-between"
              gap={8}
              pb="md"
              style={{ cursor: "move" }}
            >
              <IconGripVertical />
              <Text fw="bold" flex="1">
                {title}
              </Text>
              <Group gap={4}>
                {help && <HelpIconTooltip tooltip={help} />}
                <CloseButton
                  className="close-btn"
                  onClick={floatingWindow.close}
                />
              </Group>
            </Group>
            <ScrollArea.Autosize scrollbars="y" type="auto" mah="50vh">
              <Box>{children}</Box>
            </ScrollArea.Autosize>
          </Paper>
        </Portal>
      )}
    </>
  );
};
