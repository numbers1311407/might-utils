import { useMemo } from "react";
import { LineupsContext } from "../context.js";
import { findLineupsAsync } from "../find-lineups-async.js";
import { useLineupsStore } from "../store.js";
import { useClassTagsStore } from "@/common/tags/store.js";

const defaultRoster = [
  { name: "geese", class: "SHD", level: 68, warden: 2, active: true },
  { name: "snarf", class: "PAL", level: 66, warden: 2, active: true },
  { name: "phatos", class: "CLR", level: 67, warden: 0, active: true },
  { name: "huffpo", class: "DRU", level: 67, warden: 0, active: true },
  { name: "chacha", class: "SHM", level: 66, warden: 0, active: true },
  { name: "dellingr", class: "WIZ", level: 68, warden: 2, active: true },
  { name: "difa", class: "MAG", level: 67, warden: 2, active: true },
  { name: "guta", class: "NEC", level: 67, warden: 2, active: true },
  { name: "delulu", class: "ENC", level: 66, warden: 0, active: true },
  { name: "rodeo", class: "MNK", level: 67, warden: 2, active: true },
  { name: "kwok", class: "BST", level: 67, warden: 2, active: true },
  { name: "lala", class: "BRD", level: 66, warden: 0, active: true },
  { name: "rizzt", class: "RNG", level: 65, warden: 0, active: true },
  { name: "oldboy", class: "BER", level: 65, warden: 0, active: true },
  { name: "yeti", class: "WAR", level: 65, warden: 0, active: true },
];

export const LineupsContextProvider = ({ children }) => {
  const options = useLineupsStore((store) => store.options);
  const classTags = useClassTagsStore((store) => store.tags);
  const roster = defaultRoster;

  const resultsPromise = useMemo(
    () => findLineupsAsync(roster, options.targetScore, options),
    [roster, options],
  );

  const value = useMemo(() => {
    const { targetScore, ...restOptions } = options;

    return {
      options: {
        ...restOptions,
        classTags,
      },
      resultsPromise,
      roster,
      targetScore,
    };
  }, [options, resultsPromise, roster, classTags]);

  console.log({ value });

  return <LineupsContext value={value}>{children}</LineupsContext>;
};
