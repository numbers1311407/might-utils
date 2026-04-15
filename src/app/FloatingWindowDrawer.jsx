import { Affix, Divider, Group, Paper, Text, Tooltip } from "@mantine/core";
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
  const api = usePersistedFloatingWindowApi();

  return (
    <Affix
      position={{ bottom: 0, left: 0, right: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        pointerEvents: "none",
      }}
    >
      <Paper
        shadow="md"
        p="sm"
        margin="0 auto"
        style={{ pointerEvents: "auto" }}
      >
        <Group gap="sm">
          <Text size="sm">Floating Tools</Text>
          <HelpIconTooltip tooltip={HELP} />
          <Divider orientation="vertical" size="sm" />
          <FloatingNpcSimulator size="compact-sm" />
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
            <RestoreButton onClick={api.resetAll} variant="subtle" />
          </Tooltip>
        </Group>
      </Paper>
    </Affix>
  );
};
