import { Warden, MightScoreByLevel } from "@/config";
import { intersection } from "@/utils";
import { FindPartiesError } from "./find-parties-error.js";

export const expandRoster = (roster, { minLevel, maxLevel, groupTags }) => {
  let slotIdx = 0;

  const buckets = roster
    // filter out of bounds levels
    .filter(({ level, active }) => {
      return active && level >= minLevel && level <= maxLevel;
    })
    .reduce((buckets, char) => {
      const level = char.level;
      const score = MightScoreByLevel[level];
      const charBucket = [];
      buckets.push(charBucket);

      for (const rank of Warden.Ranks) {
        const { rank: warden, requiredLevel, mightMultiplier } = rank;
        if (char.warden >= warden && level >= requiredLevel) {
          const slot = { ...char, score: score * mightMultiplier, warden };

          if (groupTags?.length) {
            const slotGroupTags = intersection(slot.tags, groupTags);

            if (!slotGroupTags.length) {
              throw new FindPartiesError(
                "When grouping by tags, all active characters in the roster must have " +
                  `at least one of the tags in the group. Needed tags: [${groupTags.join(", ")}], ` +
                  `character ${slot.name} tags: [${slot.tags.join(", ")}].`,
                "MISSING_GROUP_TAGS",
              );
            }
          }

          charBucket.push(slot);
        }
      }

      charBucket
        .sort((a, b) => a.score - b.score)
        .forEach((slot) => {
          slot.idx = slotIdx++;
        });

      return buckets.sort((bucketA, bucketB) => {
        return bucketA[0].score - bucketB[0].score;
      });
    }, []);

  return { buckets, pool: buckets.flat() };
};
