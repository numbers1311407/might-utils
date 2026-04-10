import { Stack, SegmentedControl } from "@mantine/core";
import { useRosterStats, useRosterControls } from "@/core/hooks";
import { Aside } from "@/core/components/common";
import { CharStatsTable } from "@/core/components/chars";

export const RosterActiveFilterToggle = () => {
  const { activeOnly, setActiveOnly } = useRosterControls();

  return (
    <SegmentedControl
      value={activeOnly}
      size="sm"
      fullWidth
      data={[
        { label: "Show All", value: false },
        { label: "Hide Inactive", value: true },
      ]}
      onChange={setActiveOnly}
    />
  );
};

export const RosterAside = (props) => {
  const stats = useRosterStats();

  return (
    <Aside component={Stack} {...props}>
      <RosterActiveFilterToggle />
      <CharStatsTable stats={stats} mode="stacked" minMight />
    </Aside>
  );
};
