import { Box, Stack, SegmentedControl } from "@mantine/core";
import { useRosterStats, useRosterControls } from "@/core/hooks";
import { Aside } from "@/core/components/common";
import { CharStatsTable } from "./CharStatsTable.jsx";

export const RosterActiveFilterToggle = () => {
  const { activeOnly, setActiveOnly } = useRosterControls();

  return (
    <Box>
      <SegmentedControl
        value={activeOnly}
        color="var(--mantine-color-primary-7)"
        size="sm"
        fullWidth
        data={[
          { label: "Show All", value: false },
          { label: "Hide Inactive", value: true },
        ]}
        onChange={setActiveOnly}
      />
    </Box>
  );
};

export const RosterAside = (props) => {
  const stats = useRosterStats();

  return (
    <Aside
      component={Stack}
      {...props}
      style={{ overflow: "hidden", flexDirection: "column" }}
    >
      <RosterActiveFilterToggle />
      <CharStatsTable stats={stats} mode="stacked" minMight />
    </Aside>
  );
};
