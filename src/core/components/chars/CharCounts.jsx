import { useMemo } from "react";
import {
  Group,
  List,
  Pill,
  HoverCard,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { identity } from "@/utils";

const Target = ({
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

export const CharCounts = ({ chars, renderValue, renderCount }) => {
  const sortedChars = useMemo(
    () =>
      Object.entries(chars).sort((a, b) => {
        return b[1].length === a[1].length
          ? a[0].localeCompare(b[0])
          : b[1].length - a[1].length;
      }),
    [chars],
  );

  if (!sortedChars.length) {
    return "No Entries";
  }

  return sortedChars.map(([value, charList]) => (
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
            <List.Item key={id}>{name}</List.Item>
          ))}
        </List>
      </HoverCard.Dropdown>
    </HoverCard>
  ));
};

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
