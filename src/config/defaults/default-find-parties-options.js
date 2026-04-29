import { MightMaxLevel, MightMinLevel } from "@/config/might";

export const defaultFindPartiesOptions = {
  targetScore: 1250,
  minLevel: MightMinLevel,
  maxLevel: MightMaxLevel,
  minSize: 6,
  maxSize: 12,
  margin: 0,
  sort: "-score mightSD mightRange -mightAvg",
};
