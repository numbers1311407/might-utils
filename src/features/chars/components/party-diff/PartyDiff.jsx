import {
  alpha,
  Badge,
  Group,
  Paper,
  Text,
  Tooltip,
  Title,
  Table,
  Stack,
  useMantineTheme,
  getThemeColor,
} from "@mantine/core";
import { usePartyDiffContext } from "./party-diff-context.js";
import { PartyDiffProvider } from "./PartyDiffProvider.jsx";

const { Tr, Tbody, Thead } = Table;

const Th = ({ size = "xs", children, ...tdProps }) => {
  return (
    <Table.Th bg="secondary.8" ta="right" {...tdProps}>
      <Text size={size}>{children}</Text>
    </Table.Th>
  );
};

const Td = ({ size = "sm", children, ...tdProps }) => {
  return (
    <Table.Td
      bg="var(--mantine-color-default)"
      ff="mono"
      ta="right"
      {...tdProps}
    >
      <Text size={size}>{children}</Text>
    </Table.Td>
  );
};

const Colors = {
  INVALID_ROSTER: "error.10",
  WARDEN_UNDER: "pink.4",
  LEVEL_OVER: "warning.3",
  LEVEL_UNDER: "error.5",
  READY: "success.10",
};

export const PartyDiffColors = Colors;

const BADGE_MAP = {
  INVALID_ROSTER: [Colors.INVALID_ROSTER, "Invalid"],
  WARDEN_UNDER: [Colors.WARDEN_UNDER, "Unattained Warden"],
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
  const wardenLog = log.filter((item) => item.type === "WARDEN_UNDER");

  if (!wardenLog.length) return null;

  return wardenLog.map((item, i) => (
    <Tr key={i} c={Colors.WARDEN_UNDER}>
      <Th>{item.char}</Th>
      <Td>{item.warden}</Td>
      <Td c="green">
        {item.warden - item.warden} (-{item.warden})
      </Td>
    </Tr>
  ));
};

const PartyDiffLevelOver = (props) => {
  const { log } = props;
  const filteredLog = log.filter((item) => item.type === "LEVEL_OVER");

  return (
    <>
      {!!filteredLog.length &&
        filteredLog.map((item, i) => (
          <Tr key={i} c={Colors.LEVEL_OVER}>
            <Th>{item.char}</Th>
            <Td>{item.level}</Td>
            <Td c="green">
              {item.level + item.diff} (+{item.diff})
            </Td>
          </Tr>
        ))}
      <PartyDiffWardenOver {...props} />
    </>
  );
};

const PartyDiffLevelUnder = (props) => {
  const { log } = props;
  const filteredLog = log.filter((item) => item.type === "LEVEL_UNDER");

  return (
    <>
      {!!filteredLog.length &&
        filteredLog.map((item, i) => (
          <Tr c={Colors.LEVEL_UNDER} key={i}>
            <Th>{item.char}</Th>
            <Td>{item.level}</Td>
            <Td c="green">
              {item.level - item.diff} (-{item.diff})
            </Td>
          </Tr>
        ))}
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
  WARDEN_UNDER: PartyDiffWardenOver,
  LEVEL_OVER: PartyDiffLevelOver,
  LEVEL_UNDER: PartyDiffLevelUnder,
  READY: PartyDiffReady,
};

export const PartyDiffComponent = () => {
  const diff = usePartyDiffContext();
  const theme = useMantineTheme();
  const color = getThemeColor(Colors[diff.tier], theme);
  const background = alpha(color, 0.02);
  const Component = COMPONENT_MAP[diff?.tier];
  const isTable = !["INVALID_ROSTER", "READY"].includes(diff.tier);

  if (!Component) {
    return null;
  }

  return (
    <Paper p="md" shadow="md" style={{ background }}>
      <Stack gap="sm">
        <Group>
          <Title order={5} c="primary" flex="1">
            Party Readiness
          </Title>
          <ReadinessBadge tier={diff.tier} />
        </Group>
        {isTable ? (
          <Table
            variant="vertical"
            withColumnBorders
            withRowBorders
            withTableBorder
          >
            <Thead>
              <Tr>
                <Th></Th>
                <Th w={80}>Party</Th>
                <Th w={80}>Roster</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Component {...diff} />
            </Tbody>
          </Table>
        ) : (
          <Component {...diff} />
        )}
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
