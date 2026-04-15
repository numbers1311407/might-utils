import { Button } from "@mantine/core";
import { IconCalculator } from "@tabler/icons-react";
import { useFloatingNpcSimulator } from "@/core/components";

export const ToggleNpcSimButton = (props) => {
  const { api } = useFloatingNpcSimulator();
  return (
    <Button
      size="compact-md"
      onClick={api.toggle}
      leftSection={<IconCalculator />}
      variant="subtle"
      {...props}
    >
      Toggle instance NPC sim for this party
    </Button>
  );
};
