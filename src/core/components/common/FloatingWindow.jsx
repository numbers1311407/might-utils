import { alpha, Group, Paper, Portal, CloseButton, Text } from "@mantine/core";
import { HelpIconTooltip } from "@/core/components/common";
import { usePersistedFloatingWindow } from "@/core/hooks";
import { IconGripVertical } from "@tabler/icons-react";

const DEFAULT_WIDTH = 300;
const DEFAULT_Z_INDEX = 400;

export const FloatingWindow = ({
  children,
  help,
  name,
  title,
  width = DEFAULT_WIDTH,
  initialPosition = "auto",
  ...paperProps
}) => {
  if (!name) {
    throw new Error("Floating window requires a name for persistence");
  }

  const floatingWindow = usePersistedFloatingWindow(name, {
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
            pos="fixed"
            style={{ transition: "box-shadow 70ms ease", zIndex }}
            shadow={floatingWindow.isDragging ? "md" : "sm"}
            bd={`1px solid ${alpha("var(--mantine-color-primary-8)", 0.25)}`}
            onMouseDown={() => floatingWindow.raise()}
            ref={floatingWindow.ref}
          >
            <Group
              className="drag-handle"
              justify="space-between"
              gap={8}
              pb="md"
              style={{ cursor: "move" }}
            >
              <IconGripVertical />
              <Text flex="1">{title}</Text>
              <Group gap={4}>
                {help && <HelpIconTooltip tooltip={help} />}
                <CloseButton
                  className="close-btn"
                  onClick={floatingWindow.close}
                />
              </Group>
            </Group>
            {children}
          </Paper>
        </Portal>
      )}
    </>
  );
};
