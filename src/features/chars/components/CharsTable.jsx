import {
  alpha,
  Box,
  Group,
  Switch,
  Table,
  Text,
  getThemeColor,
  useMantineTheme,
  Tooltip,
} from "@mantine/core";
import {
  getCharMight,
  getMaxWardenForLevel,
  getMinLevelForWarden,
} from "@/config/chars";
import { charLevelSchema } from "@/model/schemas";
import {
  ClassIcon,
  EditButton,
  IncrementButtons,
  TrashButton,
  HelpIconTooltip,
  RestoreButton,
} from "@/core/components/common";
import { PartyDiffColors, usePartyDiffContext } from "./party-diff";
import { useRosterChar } from "@/core/hooks";
import { useClassTagsStore } from "@/model/store";
import { CharTagsPopover } from "./CharTagsPopover.jsx";

export const EmptyRow = ({ children }) => (
  <Table.Tr>
    <Table.Td colSpan={8} py="xl" px="4xl">
      <Box ta="center">{children}</Box>
    </Table.Td>
  </Table.Tr>
);

const getColor = (diff, char) => {
  const levelDelta = status[char.name]?.ld || 0;
  const wardenDelta = status[char.name]?.wd || 0;

  if (levelDelta < 0) {
    return [PartyDiffColors.LEVEL_UNDER, -levelDelta];
  } else if (levelDelta > 0) {
    return [PartyDiffColors.LEVEL_OVER, levelDelta];
  } else if (wardenDelta < 0) {
    return [PartyDiffColors.WARDEN_UNDER, -wardenDelta];
  } else {
    return [];
  }
};

const useErrorStyles = (char) => {
  const diff = usePartyDiffContext();
  const theme = useMantineTheme();
  const status = diff?.status;

  if (!status) {
    return {};
  }

  const [color, delta] = getColor(status, char);
  const opacity = Math.min(delta * 0.1, 0.3);
  const themeColor = alpha(getThemeColor(color, theme), opacity);

  const backgroundImage = `repeating-linear-gradient(
    45deg,
    ${themeColor} 0px,
    ${themeColor} 10px,
    transparent 15px,
    transparent 25px
  )`;

  return delta > 0
    ? { row: { style: { backgroundImage } }, name: { c: color } }
    : {};
};

const Row = ({
  char,
  classTags,
  dirtyChars,
  edit,
  hideControls,
  isRoster,
  remove,
  reset,
  update,
}) => {
  const rosterChar = useRosterChar(char.name);
  const disableControls = !rosterChar;
  const styles = useErrorStyles(char);

  return (
    <Table.Tr {...styles.row}>
      {isRoster && (
        <Table.Td>
          <Switch
            aria-label="Toggle Active Status"
            checked={char.active}
            onChange={(e) => {
              update({ active: e.currentTarget.checked });
            }}
          />
        </Table.Td>
      )}
      {isRoster && !hideControls && (
        <Table.Td>
          <Text size="lg" style={{ opacity: char.active ? 1 : 0.5 }}>
            {char.name}
          </Text>
        </Table.Td>
      )}
      <Table.Td>
        <Group gap={8} wrap="nowrap">
          <ClassIcon
            size={24}
            cls={char.class}
            style={{ opacity: !isRoster || char.active ? 1 : 0.25 }}
          />
          <Text
            style={{ opacity: !isRoster || char.active ? 1 : 0.5 }}
            {...styles.name}
          >
            {isRoster && !hideControls ? char.class : char.name}
          </Text>
        </Group>
      </Table.Td>
      {!hideControls && (
        <Table.Td ta="center">
          {isRoster && char.warden > 0 && (
            <>
              <Text c="primary.6" span title="Unwardened" ff="mono">
                {getCharMight(char, 0)}
              </Text>{" "}
              -{" "}
            </>
          )}
          <Text c="primary.3" span title={`Warden ${char.warden}`} ff="mono">
            {getCharMight(char)}
          </Text>
        </Table.Td>
      )}
      <Table.Td ta="center">
        <IncrementButtons
          value={char.level}
          disabled={disableControls}
          min={getMinLevelForWarden(char.warden)}
          max={charLevelSchema.maxValue}
          onChange={(level) => update({ level })}
        />
      </Table.Td>
      <Table.Td ta="center">
        <IncrementButtons
          value={char.warden}
          disabled={disableControls}
          min={0}
          max={getMaxWardenForLevel(char.level)}
          onChange={(warden) => update({ warden })}
        />
      </Table.Td>
      {isRoster && (
        <Table.Td align="center">
          <CharTagsPopover tags={char.tags} classTags={classTags[char.class]} />
        </Table.Td>
      )}
      {!hideControls && (
        <Table.Td>
          <Group gap={6} justify="flex-end" wrap="nowrap">
            {!disableControls && !isRoster && dirtyChars && (
              <Tooltip
                openDelay={500}
                label="Reset character to roster version"
              >
                <RestoreButton
                  aria-label="Reset character to roster version"
                  onClick={() => reset(char.name)}
                  disabled={!dirtyChars.has(char.name)}
                />
              </Tooltip>
            )}
            {!disableControls && isRoster && edit && (
              <Tooltip openDelay={500} label="Edit character">
                <EditButton
                  aria-label="Edit character"
                  onClick={() => edit(char)}
                />
              </Tooltip>
            )}
            {disableControls && (
              <HelpIconTooltip
                c="error"
                size="sm"
                tooltip="This character is missing from the active roster and cannot be edited unless the roster character is restored."
              />
            )}
            {remove && (
              <Tooltip openDelay={500} label="Remove character">
                <TrashButton
                  aria-label="Remove character"
                  onClick={() => remove(char)}
                />
              </Tooltip>
            )}
          </Group>
        </Table.Td>
      )}
    </Table.Tr>
  );
};

// TODO this thing started off as the main roster index and is now
// pulling some serious double duty. It should probably be refactored.
export const CharsTable = ({
  activeStar,
  chars,
  dirtyChars,
  onEdit,
  onUpdate,
  onRemove,
  onReset,
  isRoster,
  stickyHeader = true,
  hideControls = false,
  emptyContent = null,
  ...props
}) => {
  const classTags = useClassTagsStore((store) => store.tags);

  return (
    <Table stickyHeader={stickyHeader} stickyHeaderOffset={66} {...props}>
      <Table.Thead>
        <Table.Tr>
          {isRoster && (
            <Table.Th width={65}>
              Active
              {activeStar && (
                <Text span c="primary" size="xl" pos="absolute" lh={1}>
                  *
                </Text>
              )}
            </Table.Th>
          )}
          {isRoster && !hideControls && <Table.Th>Name</Table.Th>}
          <Table.Th w={70}>
            {isRoster && !hideControls ? "Class" : "Name"}
          </Table.Th>
          {!hideControls && (
            <Table.Th ta="center" w={isRoster && !hideControls ? 140 : 80}>
              Might
            </Table.Th>
          )}
          <Table.Th ta="center" width={72}>
            Level
          </Table.Th>
          <Table.Th ta="center" width={72}>
            Warden
          </Table.Th>
          {isRoster && <Table.Th width={50}>Tags</Table.Th>}
          {(isRoster || !hideControls) && (
            <Table.Th width={90} ta="right"></Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!chars.length && (
          <EmptyRow>{emptyContent || "No characters found"}</EmptyRow>
        )}
        {chars.map((char) => (
          <Row
            key={char.name}
            char={char}
            classTags={classTags}
            dirtyChars={dirtyChars}
            edit={onEdit}
            hideControls={hideControls}
            remove={onRemove}
            reset={onReset}
            isRoster={isRoster}
            update={(update) => onUpdate(char.name, update)}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
};

CharsTable.EmptyRow = EmptyRow;
CharsTable.Row = Row;
