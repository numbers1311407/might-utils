import { Warden, MightScoreByLevel } from "@/config";
import { intersection } from "@/utils";
import { FindPartiesError } from "./find-parties-error.js";

export const expandRoster = (roster, { minLevel, maxLevel, groupTags }) => {
  const buckets = roster
    // filter out of bounds levels
    .filter(({ level, active }) => {
      return active && level >= minLevel && level <= maxLevel;
    })
    .reduce((buckets, char) => {
      const level = char.level;
      const score = MightScoreByLevel[level];
      const charBucket = [];

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

      // sort each bucket by ascending score, this is expected by the algorithm to function
      charBucket.sort((a, b) => a.score - b.score);

      buckets.push(charBucket);
      return buckets;
    }, []);

  // Then sort all the buckets by ascending score. This is less critical than sorting the
  // individual buckets, but the algorithm does expect the first slot in the first bucket to
  // be the lowest score for purpose of detecting if the target margin is larger than the
  // lowest possible slot score.
  buckets.sort((bucketA, bucketB) => bucketA[0].score - bucketB[0].score);

  // Finally tack the slot "idx" into each character in the buckets as for the purposes of
  // the algorithm, we're accessing pool slots out of context by their pool index (while
  // referending them from their buckets, not the flat pool)
  const pool = buckets.flat();
  pool.forEach((slot, idx) => {
    slot.idx = idx;
  });

  return { buckets, pool };
};
