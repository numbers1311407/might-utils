import { useMemo } from "react";
import { useAppStorage } from "@/lib/store";
import { findLineupsAsync, LineupsContext } from "@/lib/lineups";

export const LineupsContextProvider = ({ children }) => {
  const [{ lineups, roster }] = useAppStorage();
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
