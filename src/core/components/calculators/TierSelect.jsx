import { useMemo } from "react";
import { Select } from "@mantine/core";
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

export const TierSelect = ({ onChange, value: propsValue, ...props }) => {
  const value = useMemo(() => {
    return propsValue ? Object.values(propsValue).join(":") : "";
  }, [propsValue]);

  return (
    <Select
      size="md"
      value={value}
      {...props}
      data={TIER_DATA}
      onChange={(value) => {
        const [tier, type, might] = value.split(":");
        onChange?.({ tier, type, might: Number(might) });
      }}
    />
  );
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
].map((value) => ({
  label: `Difficulty ${value}`,
  value,
}));

export const DifficultySelect = ({ onChange, ...props }) => {
  return (
    <Select
      size="md"
      {...props}
      data={DIFF_OPTIONS}
      onChange={(value, option) => {
        onChange?.(value, option);
      }}
    />
  );
};
