import { Switch, Group, Text } from "@mantine/core";
import { usePreference } from "@/core/hooks";
import { HelpIconTooltip } from "@/core/components";
import { usePartyDiffContext } from "./party-diff-context.js";

export const PartyDiffToggle = (props) => {
  const [showPartyDiffs, setShowPartyDiffs] = usePreference("showPartyDiffs");
  const diff = usePartyDiffContext();
  const aligned = !diff?.score;
  const tooltip = aligned
    ? "This party's levels are in alignment with the roster besides the potential need to swap warden rings."
    : "Toggle to show indicators for party characters with significant differences from the roster for warden or character level.";
  const logLength = diff?.log?.length || 0;
  const subject = logLength === 1 ? "diff" : "diffs";
  const label = showPartyDiffs
    ? `${logLength} ${subject} shown`
    : `Show ${logLength} ${subject}`;

  return (
    <Group gap={10}>
      {aligned ? (
        <Text size="sm" c="success.10">
          Roster aligned
        </Text>
      ) : (
        <Switch
          checked={showPartyDiffs}
          onChange={setShowPartyDiffs}
          {...props}
          label={label}
          styles={{
            label: {
              color: "var(--mantine-color-warning-2)",
            },
          }}
          labelPosition="left"
        />
      )}
      <HelpIconTooltip tooltip={tooltip} />
    </Group>
  );
};
