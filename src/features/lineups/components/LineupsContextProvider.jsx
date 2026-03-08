import { useMemo } from "react";
import { useAppStorage } from "@/common/store";
import { LineupsContext } from "../context.js";
import { defaultOptions } from "../find-lineups.js";
import { findLineupsAsync } from "../find-lineups-async.js";

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
  const [{ lineups = defaultOptions, roster = defaultRoster }] =
    useAppStorage();
  const targetScore = lineups.targetScore;
  const options = useMemo(() => {
    return {
      margin: lineups.margin,
      maxLevel: lineups.maxLevel,
      minLevel: lineups.minLevel,
      maxSize: lineups.maxSize,
      minSize: lineups.minSize,
    };
  }, [lineups]);

  const resultsPromise = useMemo(
    () => findLineupsAsync(roster, targetScore, options),
    [roster, targetScore, options],
  );

  const value = useMemo(
    () => ({
      options,
      resultsPromise,
      roster,
      targetScore,
    }),
    [options, resultsPromise, roster, targetScore],
  );

  return <LineupsContext value={value}>{children}</LineupsContext>;
};
