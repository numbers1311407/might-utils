import { Warden } from "@/config/warden";
import { charLevelSchema } from "@/core/schemas";

export const getMaxWardenForLevel = (() => {
  const cache = {};
  return (level) => {
    if (cache[level] == undefined) {
      const maxRank = [...Warden.Ranks]
        .reverse()
        .find((rank) => rank.requiredLevel <= level);
      cache[level] = maxRank.rank || 0;
    }
    return cache[level];
  };
})();

export const getMinLevelForWarden = (rank) => {
  return Warden.RankMap.get(rank)?.requiredLevel || charLevelSchema.min;
};
