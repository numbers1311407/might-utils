import { MightScoreByLevel, Warden } from "@/core/config";

export const getCharMight = (char, warden = char.warden) => {
  const mightScore = MightScoreByLevel[char.level];
  const wardenMult = Warden.RankMap.get(warden).mightMultiplier;
  return mightScore * wardenMult;
};
