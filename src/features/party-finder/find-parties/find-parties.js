import {
  Warden,
  MightScoreByLevel,
  MightMaxLevel,
  MightMinLevel,
} from "@/core/config";
import { createPartyValidator } from "@/core/finder-rules";
import { FindPartiesError } from "./find-parties-error.js";
import { getGroupingOverrides, getTagGroupKey } from "./grouping.js";
import { instrument } from "@/utils";

const MAX_RECURSIONS = 10_000_000;
const MAX_RESPONSE_LENGTH = 2500;

export const defaultOptions = {
  targetScore: 1250,
  minLevel: MightMinLevel,
  maxLevel: MightMaxLevel,
  minSize: 6,
  maxSize: 12,
  margin: 0,
  distinctGroupingTags: true,
};

export const findParties = (roster, targetScore, options = {}) => {
  const instr = instrument();

  const {
    distinctGroupingTags,
    groupBy,
    margin,
    maxLevel,
    minLevel,
    rules = [],
    ...restOptions
  } = {
    ...defaultOptions,
    ...options,
  };

  const minSize = restOptions.size || restOptions.minSize;
  const maxSize = restOptions.size || restOptions.maxSize;
  const maxPoolScores = new Map();

  let slotIdx = 0;

  instr.start("setupPool");
  const buckets = roster
    // filter out of bounds levels
    .filter(({ level, active }) => {
      return active && level >= minLevel && level <= maxLevel;
    })
    .reduce((acc, char) => {
      const level = char.level;
      const score = MightScoreByLevel[level];
      const charBucket = [];
      acc.push(charBucket);

      for (const rank of Warden.Ranks) {
        const { rank: warden, requiredLevel, mightMultiplier } = rank;
        if (char.warden >= warden && level >= requiredLevel) {
          const slot = { ...char, score: score * mightMultiplier, warden };

          if (groupBy) {
            const overrides = getGroupingOverrides(
              slot,
              groupBy,
              distinctGroupingTags,
            );
            for (const ovr of overrides) {
              charBucket.push({ ...slot, ...ovr });
            }
          } else {
            charBucket.push(slot);
          }
        }
      }

      charBucket
        .sort((a, b) => a.score - b.score)
        .forEach((slot) => {
          slot.idx = slotIdx++;
        });

      return acc;
    }, []);

  const pool = buckets.flat();

  // minSumLookup and maxSumLookup will contain calculated possible
  // min and max values for the remaining buckets in the list, taking
  // into account how many more slots are available. this is done here
  // so later during recursion we can quickly check to see if the
  // sum of the scores left in the buckets can possible land in the
  // target range.
  const minSumLookup = [];
  const maxSumLookup = [];

  for (let i = 0; i < buckets.length; i++) {
    const remainingMins = [];
    const remainingMaxs = [];

    for (let b = i; b < buckets.length; b++) {
      remainingMins.push(buckets[b][0].score);
      remainingMaxs.push(buckets[b][buckets[b].length - 1].score);
    }

    remainingMins.sort((a, b) => a - b);
    remainingMaxs.sort((a, b) => b - a);

    const minSums = [0];
    const maxSums = [0];

    for (let j = 1; j <= maxSize; j++) {
      minSums[j] = minSums[j - 1] + (remainingMins[j - 1] || 0);
      maxSums[j] = maxSums[j - 1] + (remainingMaxs[j - 1] || 0);
    }

    minSumLookup[i] = minSums;
    maxSumLookup[i] = maxSums;
  }

  instr.end("setupPool");

  if (!pool.length) {
    throw new FindPartiesError(
      "No eligible roster members found, check your min/max character levels and roster.",
      "EMPTY_ROSTER",
    );
  }

  if (pool[0].score <= margin) {
    throw new FindPartiesError(
      `Margin must be less than minimum individual score of ${pool[0].score}, received ${margin}.`,
      "MARGIN_TOO_SMALL",
    );
  }

  const sortParties = (parties) =>
    parties.sort((a, b) => {
      return a.size === b.size ? b.score - a.score : b.size - a.size;
    });

  const sortParty = (idxs) => {
    return idxs.sort((a, b) => pool[a].name.localeCompare(pool[b].name));
  };

  instr.start("setupValidator");
  const validator = createPartyValidator(rules, pool);
  instr.end("setupValidator");

  // NOTE this is the parties array in the response
  const parties = [];

  // individual responsese don't repeat data, they return arrays containing indexes of
  // the pool array
  const partyPoolIdxs = new Set();

  let recursionCount = 0;

  const recurse = (remainingScore, bucketIndex) => {
    if (parties.length >= MAX_RESPONSE_LENGTH) {
      return;
    }

    if (recursionCount++ >= MAX_RECURSIONS) {
      throw new FindPartiesError(
        `Max recursions reached (${MAX_RECURSIONS.toLocaleString()}) trying to assemble the parties. Try adding ` +
          `more rules or reducing your roster size.`,
        "MAX_RECURSIONS",
      );
    }

    const partySize = partyPoolIdxs.size;

    if (
      remainingScore >= 0 &&
      remainingScore <= margin &&
      partySize >= minSize &&
      partySize <= maxSize
    ) {
      if (!validator.test(partyPoolIdxs)) {
        return;
      }

      const newParty = {
        party: sortParty(new Uint8Array(partyPoolIdxs)),
        score: targetScore - remainingScore,
      };

      if (groupBy) {
        newParty.groupKey = getTagGroupKey(
          groupBy,
          Array.from(partyPoolIdxs),
          pool,
        );
      }

      parties.push(newParty);
    }

    if (
      bucketIndex >= buckets.length ||
      partyPoolIdxs.size >= maxSize ||
      remainingScore <= 0
    ) {
      return;
    }

    // look up the possible min and max scores for the remaining slots within
    // the party size bounds and if the minimum possible score from the slots
    // left is over the target score, or the maximum possible score for the
    // slots left is under the target score minus margin, we can prune the branch
    const minSlotsLeft = Math.max(0, minSize - partySize);
    const maxSlotsLeft = Math.max(0, maxSize - partySize);
    const remainingMin = minSumLookup[bucketIndex][minSlotsLeft];
    const remainingMax = maxSumLookup[bucketIndex][maxSlotsLeft];
    const minRemainingScore = remainingScore - margin;
    if (remainingMin > remainingScore || remainingMax < minRemainingScore) {
      return;
    }

    const charBucket = buckets[bucketIndex];

    for (let i = 0; i < charBucket.length; i++) {
      const slot = charBucket[i];

      if (slot.score > remainingScore) break;

      partyPoolIdxs.add(slot.idx);
      recurse(remainingScore - slot.score, bucketIndex + 1);
      partyPoolIdxs.delete(slot.idx);
    }

    recurse(remainingScore, bucketIndex + 1);
  };

  instr.wrap("findParty", () => {
    recurse(targetScore, 0);
  });

  // TODO possibly figure out flattening of response after we figure out tags, i.e.
  //
  // {
  //   pool,
  //   poolPartyIndices: new UintArray8([p0_0, p0_1, p1_0, p1_1, p1_2, p3_0, ...]),
  //   partySlices: new UintArray8([0, 2, 5]), // => [0, 2], [2, 5], [5]
  // }
  //
  // the question of this approach is that parties carry slightly more data than
  // who's in them, namely the group key, but that could also be found on the
  // other side. Is there anything calculable here that's not calculable in the UI.
  return {
    parties: sortParties(parties),
    params: { roster, targetScore, options },
    pool,
    size: parties.length,
    groupBy,
    perf: {
      recursions: recursionCount,
      timing: instr.finish(),
    },
  };
};
