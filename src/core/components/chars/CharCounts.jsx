import { useMemo } from "react";
import {
  Group,
  List as MantineList,
  Pill,
  HoverCard,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { identity } from "@/utils";

const DefaultList = MantineList;
const DefaultListItem = MantineList.Item;
const DefaultTarget = ({
  value,
  count,
  renderValue = identity,
  renderCount = identity,
}) => {
  return (
    <Group gap={2}>
      <Text span c="bright">
        {renderCount(count)}
      </Text>
      <Text span c="primary">
        x
      </Text>
      <Text span c="bright">
        {renderValue(value)}
      </Text>
    </Group>
  );
};

export const CharCounts = ({
  chars,
  List = DefaultList,
  ListItem = DefaultListItem,
  Target = DefaultTarget,
  renderValue,
  renderCount,
}) => {
  // TODO fix memo for compiler
  return useMemo(() => {
    if (!Object.keys(chars).length) {
      return "No Entries";
    }

    return Object.entries(chars)
      .sort((a, b) => {
        return b[1].length === a[1].length
          ? a[0].localeCompare(b[0])
          : b[1].length - a[1].length;
      })
      .map(([value, charList]) => (
        <HoverCard key={value} width={150} shadow="md" openDelay={300}>
          <HoverCard.Target>
            <UnstyledButton component={Pill} flex="0 0 auto">
              <Target
                value={value}
                count={charList.length}
                renderValue={renderValue}
                renderCount={renderCount}
              />
            </UnstyledButton>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text c="primary">
              {charList.length} Character{charList.length === 1 ? "" : "s"}
            </Text>
            <List size="sm">
              {charList.map(({ id, name }) => (
                <ListItem key={id}>{name}</ListItem>
              ))}
            </List>
          </HoverCard.Dropdown>
        </HoverCard>
      ));
  }, [chars, List, ListItem, Target]);
};

CharCounts.DefaultTarget = DefaultTarget;
CharCounts.DefaultList = DefaultList;
CharCounts.DefaultListItem = DefaultListItem;

export const TagCharCounts = (props) => {
  return <CharCounts {...props} renderValue={(value) => `"${value}"`} />;
};

export const WardenCharCounts = (props) => {
  return (
    <CharCounts
      {...props}
      renderValue={(value) => (value == "0" ? "Unwardened" : `Rank ${value}`)}
    />
  );
};
