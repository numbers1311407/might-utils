import { MightMinLevel } from "./might";

const Ranks = [
  {
    rank: 0,
    mightMultiplier: 1,
    requiredLevel: MightMinLevel,
  },
  {
    rank: 1,
    mightMultiplier: 1.5,
    requiredLevel: 66,
  },
  {
    rank: 2,
    mightMultiplier: 1.75,
    requiredLevel: 67,
  },
  {
    rank: 3,
    mightMultiplier: 2.0,
    requiredLevel: 68,
  },
];

export const Warden = {
  Ranks,
  RankMap: new Map(Ranks.map((rank) => [rank.rank, rank])),
};
