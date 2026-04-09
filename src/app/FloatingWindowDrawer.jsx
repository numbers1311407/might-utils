import { alpha, Affix, Divider, Group, Text, Tooltip } from "@mantine/core";
import { usePersistedFloatingWindowApi } from "@/core/hooks";
import {
  FloatingNpcSimulator,
  FloatingMightRangeFinder,
  FloatingRoster,
  HelpIconTooltip,
  RestoreButton,
} from "@/core/components";

const HELP =
  "These buttons will open floating windows containing useful controls you might want on different pages of the app. They'll stay where you leave them on close.";

export const FloatingWindowDrawer = () => {
  const w = 640;
  const api = usePersistedFloatingWindowApi();

  return (
    <Affix w={w} position={{ bottom: 0, left: `calc(50vw - ${w * 0.5}px)` }}>
      <Group
        p="sm"
        // bg="var(--mantine-primary-color-9)"
        bg="var(--mantine-color-red-9)"
        bd={`1px solid ${alpha("var(--mantine-color-primary-5)", 0.25)}`}
        style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
        gap="sm"
      >
        <Text>Floating Tools</Text>
        <HelpIconTooltip tooltip={HELP} />
        <Divider orientation="vertical" size="sm" />
        <FloatingNpcSimulator />
        <FloatingMightRangeFinder />
        <FloatingRoster />
        <Divider orientation="vertical" size="sm" />
        <Tooltip
          openDelay={400}
          label="Close and reset all floating windows to default positions"
          zIndex={1000}
          multiline
          withArrow
          w={240}
        >
          <RestoreButton onClick={api.resetAll} />
        </Tooltip>
      </Group>
    </Affix>
  );
};
