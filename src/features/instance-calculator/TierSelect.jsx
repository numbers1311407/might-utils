import { Select } from "@mantine/core";
import { useRef, useState } from "react";
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

export const TierSelect = ({ onChange, ...props }) => {
  const [search, setSearch] = useState("");
  const ref = useRef();

  return (
    <Select
      size="md"
      {...props}
      data={TIER_DATA}
      onSearchChange={setSearch}
      ref={ref}
      searchValue={search}
      searchable
      selectFirstOptionOnChange
      onFocus={() => {
        setSearch("");
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
      onChange={(value, option) => {
        const [tier, type, might] = value.split(":");
        (onChange?.({ tier, type, might: Number(might) }), setSearch(""));
        ref.current?.blur();
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
  const [search, setSearch] = useState("");
  const ref = useRef();

  return (
    <Select
      size="md"
      {...props}
      data={DIFF_OPTIONS}
      onSearchChange={setSearch}
      ref={ref}
      searchValue={search}
      searchable
      selectFirstOptionOnChange
      onFocus={() => {
        setSearch("");
      }}
      onDropdownClose={() => {
        ref.current?.blur();
      }}
      onChange={(value, option) => {
        onChange?.(value, option);
        setSearch("");
        ref.current?.blur();
      }}
    />
  );
};
