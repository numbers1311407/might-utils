import { useMemo, useState } from "react";
import { Select, RemoveScroll } from "@mantine/core";
import { capitalize } from "@/utils";
import csvData from "@/assets/instance-data.csv?tiers";

const TIER_DATA = Object.entries(csvData).reduce(
  (acc, [type, tiers]) =>
    acc.concat({
      group: capitalize(type),
      items: Object.entries(tiers)
        .sort((a, b) => Number(a[1]) - Number(b[1]))
        .map(([tier, might]) => ({
          label: `${tier.replace("T", "Tier ")} ${capitalize(type)}, Might: ${might}`,
          value: `${tier}:${type}:${might}`,
        })),
    }),
  [],
);

const instanceToValue = (instance) =>
  ["tier", "type", "might"].map((k) => instance[k]).join(":");
const valueToInstance = (value) => {
  const [tier, type, might] = value.split(":");
  return { tier, type, might: Number(might) };
};

export const TierSelect = ({
  onChange,
  value: propsValue,
  zIndex = 800,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => {
    return propsValue ? instanceToValue(propsValue) : "";
  }, [propsValue]);

  return (
    <RemoveScroll enabled={open}>
      <Select
        size="md"
        value={value}
        {...props}
        data={TIER_DATA}
        allowDeselect={false}
        maxDropdownHeight="40vh"
        leftSection="Tier"
        styles={{
          input: {
            paddingLeft: 70,
          },
        }}
        leftSectionWidth={60}
        leftSectionProps={{
          style: {
            background: "var(--mantine-color-default-border)",
          },
        }}
        comboboxProps={{ zIndex }}
        onDropdownOpen={() => setOpen(true)}
        onDropdownClose={() => setOpen(false)}
        onChange={(value) => {
          onChange?.(valueToInstance(value));
        }}
      />
    </RemoveScroll>
  );
};

const humanDifficulties = {
  H: "Hard",
  N: "Normal",
  E: "Easy",
  I: "Intense",
};
const DIFF_OPTIONS = [
  "E-",
  "E",
  "E+",
  "N-",
  "N",
  "N+",
  "H-",
  "H",
  "H+",
  "I",
  "I+",
].map((value) => {
  const [initial, diff] = value.split("");
  return {
    label: `Difficulty: ${humanDifficulties[initial]}${diff ?? ""}`,
    value,
  };
});

export const DifficultySelect = ({ onChange, zIndex = 800, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <RemoveScroll enabled={open}>
      <Select
        size="md"
        {...props}
        data={DIFF_OPTIONS}
        styles={{
          input: {
            paddingLeft: 70,
          },
        }}
        leftSectionWidth={60}
        leftSectionProps={{
          style: {
            background: "var(--mantine-color-default-border)",
          },
        }}
        allowDeselect={false}
        leftSection="Diff."
        comboboxProps={{ zIndex }}
        maxDropdownHeight="40vh"
        onDropdownOpen={() => setOpen(true)}
        onDropdownClose={() => setOpen(false)}
        onChange={(value, option) => {
          onChange?.(value, option);
        }}
      />
    </RemoveScroll>
  );
};
