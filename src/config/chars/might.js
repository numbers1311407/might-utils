import { MightScoreByLevel } from "@/config/might";
import { Warden } from "@/config/warden";

export const getCharMight = (char, warden = char.warden) => {
  if (!char?.level || warden === undefined) return 0;

  const mightScore = MightScoreByLevel[char.level];
  const rank = Warden.RankMap.get(warden);
  const wardenMult =
    char.level >= rank.requiredLevel ? rank.mightMultiplier : 1;
  return mightScore * wardenMult;
};
