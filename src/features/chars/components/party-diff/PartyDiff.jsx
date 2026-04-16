import {
  alpha,
  Badge,
  Group,
  List,
  Paper,
  Text,
  Title,
  Stack,
  useMantineTheme,
  getThemeColor,
} from "@mantine/core";
import { usePartyDiffContext } from "./party-diff-context.js";
import { PartyDiffProvider } from "./PartyDiffProvider.jsx";

const Colors = {
  INVALID_ROSTER: "error.10",
  WARDEN_OVER: "warning.3",
  LEVEL_OVER: "error.3",
  LEVEL_UNDER: "error.4",
  READY: "success.10",
};

const BADGE_MAP = {
  INVALID_ROSTER: [Colors.INVALID_ROSTER, "Invalid"],
  WARDEN_OVER: [Colors.WARDEN_OVER, "Unattained Warden"],
  LEVEL_OVER: [Colors.LEVEL_OVER, "Over-leveled"],
  LEVEL_UNDER: [Colors.LEVEL_UNDER, "Under-leveled"],
  READY: [Colors.READY, "Ready!"],
};

const ReadinessBadge = ({ tier }) => {
  const [color, message] = BADGE_MAP[tier];

  return (
    <Badge size="md" bg={color}>
      {message}
    </Badge>
  );
};

const PartyDiffWardenOver = ({ log }) => {
  const wardenLog = log.filter((item) => item.type === "WARDEN_OVER");

  if (!wardenLog.length) return null;

  return (
    <>
      <Text c={Colors.WARDEN_OVER} size="sm">
        Invalid warden ranks!
      </Text>
      <List size="sm">
        {wardenLog.map((item, i) => (
          <List.Item key={i}>
            <Text c="primary" size="sm" span>
              {item.char}:
            </Text>{" "}
            Party has rk.
            {item.warden} but roster rk. is only {item.warden - item.diff}
          </List.Item>
        ))}
      </List>
    </>
  );
};

const PartyDiffLevelOver = (props) => {
  const { log } = props;
  const filteredLog = log.filter((item) => item.type === "LEVEL_OVER");

  return (
    <>
      {!!filteredLog.length && (
        <>
          <Text c={Colors.LEVEL_OVER} size="sm">
            Deleveling required!
          </Text>
          <List size="sm">
            {filteredLog.map((item, i) => (
              <List.Item key={i}>
                <Text c="primary" size="sm" span>
                  {item.char}:
                </Text>{" "}
                Party only requires {item.level} but roster char is{" "}
                {item.level + item.diff}
              </List.Item>
            ))}
          </List>
        </>
      )}
      <PartyDiffWardenOver {...props} />
    </>
  );
};

const PartyDiffLevelUnder = (props) => {
  const { log } = props;
  const filteredLog = log.filter((item) => item.type === "LEVEL_UNDER");

  return (
    <>
      {!!filteredLog.length && (
        <>
          <Text c={Colors.LEVEL_UNDER} size="sm">
            Leveling required!
          </Text>
          <List size="sm">
            {filteredLog.map((item, i) => (
              <List.Item key={i}>
                <Text c="primary" size="sm" span>
                  {item.char}:
                </Text>{" "}
                Party requires {item.level} but roster char is only{" "}
                {item.level - item.diff}
              </List.Item>
            ))}
          </List>
        </>
      )}
      <PartyDiffLevelOver {...props} />
    </>
  );
};

const PartyDiffInvalidRoster = (props) => {
  return (
    <>
      <Text size="md" c={Colors.INVALID_ROSTER}>
        Missing roster characters: {props.missing.join(", ")}
      </Text>
      <Text size="sm">
        This party is missing characters from the roster. They'll need to be
        replaced or restored to make this party valid.
      </Text>
    </>
  );
};

const PartyDiffReady = (props) => {
  return (
    <>
      <Text c={Colors.READY}>
        This party can be assembled with your current roster.
      </Text>
      <Text size="sm">
        This party uses{" "}
        <Text c="gold" size="sm" span>
          {props.warden.ratio * 100}%
        </Text>{" "}
        of your available warden ranks. You may need to swap warden rings but
        you can assemble this party without adjusting levels.
      </Text>
    </>
  );
};

const COMPONENT_MAP = {
  INVALID_ROSTER: PartyDiffInvalidRoster,
  WARDEN_OVER: PartyDiffWardenOver,
  LEVEL_OVER: PartyDiffLevelOver,
  LEVEL_UNDER: PartyDiffLevelUnder,
  READY: PartyDiffReady,
};

export const PartyDiffComponent = () => {
  const diff = usePartyDiffContext();
  const theme = useMantineTheme();
  const color = getThemeColor(Colors[diff.tier], theme);
  const background = alpha(color, 0.1);
  const Component = COMPONENT_MAP[diff?.tier];

  if (!Component) {
    return null;
  }

  return (
    <Paper p="md" shadow="md" style={{ background }}>
      <Stack gap="sm">
        <Group>
          <Title order={4} c="primary" flex="1">
            Party Readiness
          </Title>
          <ReadinessBadge tier={diff.tier} />
        </Group>
        <Stack gap="sm">
          <Component {...diff} />
        </Stack>
      </Stack>
    </Paper>
  );
};

export const PartyDiff = ({ partyId }) => {
  return (
    <PartyDiffProvider partyId={partyId}>
      <PartyDiffComponent />
    </PartyDiffProvider>
  );
};
