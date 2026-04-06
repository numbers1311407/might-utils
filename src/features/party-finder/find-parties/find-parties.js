import * as tags from "@/core/tags";
import {
  Warden,
  MightScoreByLevel,
  MightMaxLevel,
  MightMinLevel,
} from "@/core/config";
import { createPartyValidator } from "@/core/finder-rules";
import { getGroupingOverrides, getTagGroupKey } from "./grouping.js";
import { instrument } from "@/utils";

const MAX_RECURSIONS = 5_000_000;

export const defaultOptions = {
  targetScore: 1250,
  minLevel: MightMinLevel,
  maxLevel: MightMaxLevel,
  minSize: 6,
  maxSize: 12,
  margin: 0,
  distinctGroupingTags: true,
  // distinctGroupingTags: false,
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

  // TODO only checking these 2 args here as the options are assumed to be backed
  // by defaults but technically we should be determining whwat baseline args
  // we really want to require and validating everything here up front.
  //
  // TODO one validation that's probably necessary is that group size based tag rules never
  // require fewer tags total or smaller counts of those tags as the group size grows.
  // This will allow early determination of whether the remaining roster can possibly
  // satisfy tag rules.
  if (roster === undefined || targetScore === undefined) {
    throw new Error("Invalid call: Roster and targetScore required");
  }

  const minSize = restOptions.size || restOptions.minSize;
  const maxSize = restOptions.size || restOptions.maxSize;
  const maxPoolScores = new Map();

  instr.start("setupPool");
  const pool = roster
    // filter out of bounds levels
    .filter(({ level, active }) => {
      return active && level >= minLevel && level <= maxLevel;
    })
    .reduce((acc, char) => {
      const level = char.level;
      const score = MightScoreByLevel[level];

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
              acc.push({ ...slot, ...ovr });
            }
          } else {
            acc.push(slot);
          }
        }
      }

      return acc;
    }, [])
    // NOTE it's critical to note the pool is sorted by ascending score
    .sort((a, b) => a.score - b.score);

  for (let i = 0; i < pool.length; i++) {
    const slot = pool[i];
    slot.idx = i;

    maxPoolScores.set(
      slot.id,
      Math.max(maxPoolScores.get(slot.id) || 0, slot.score),
    );
  }

  instr.end("setupPool");

  instr.start("setupValidator");
  const validator = createPartyValidator(rules, pool);
  instr.end("setupValidator");

  if (!pool.length) {
    throw new Error("no eligible roster members found");
  }

  if (pool[0].score <= margin) {
    throw new Error(
      `Margin must be less than minimum individual score: (${pool[0].score}), got: ${margin}`,
    );
  }

  const sortParties = (parties) =>
    parties.sort((a, b) => {
      return a.size === b.size ? b.score - a.score : b.size - a.size;
    });

  const sortParty = (idxs) => {
    return idxs.sort((a, b) => pool[a].name.localeCompare(pool[b].name));
  };

  const generateTagCounts = (idxs) =>
    tags.generateTagCounts(Array.from(idxs).map((idx) => pool[idx]));

  // NOTE this is the parties array in the response
  const parties = [];

  // individual responsese don't repeat data, they return arrays containing indexes of
  // the pool array
  const partyPoolIdxs = new Set();
  // the party ids need to be tracked during recursion as well to skip repeat slots for
  // roster chars already in the party
  const partyIds = new Set();

  // Optimization helper that adds up the highest score slots remaining to test
  // if there's even enough points left in the pool to hit the min score.
  const getMaxPoolScore = (slotsLeft, startIndex) => {
    let score = 0;
    // start at the end as it's presorted by score
    for (let i = pool.length - 1; i >= startIndex; i--) {
      // skip out slots for chars already in the party
      if (partyPoolIdxs.has(pool[i].idx)) continue;
      // and add up the rest for count of slots left
      score += pool[i].score;
      if (--slotsLeft === 0) break;
    }

    return score;
  };

  let recursionCount = 0;

  const recurse = (remainingScore, partyPoolIdxs, startIndex) => {
    if (recursionCount++ >= MAX_RECURSIONS) {
      throw new Error("max recursions reached, try increasing specificity");
    }

    // member remaining even adds up to the desired score.
    const partySize = partyPoolIdxs.size;

    if (remainingScore >= 0 && remainingScore <= margin) {
      // and the party size is not too short or too long
      if (partySize >= minSize && partySize <= maxSize) {
        // and the parties is valid re: tags
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

        // push the completed linup and end this branch
        parties.push(newParty);
      }

      return;
    }

    if (partySize >= maxSize || remainingScore <= 0) {
      return;
    }

    const maxPoolScore = getMaxPoolScore(maxSize - partySize, startIndex);
    if (maxPoolScore < remainingScore - margin) {
      return;
    }

    for (let i = startIndex; i < pool.length; i++) {
      const slot = pool[i];

      // if we're over the score break out of this loop entirely as this party is full.
      if (slot.score > remainingScore) {
        break;
      }

      // but if this slot's char is already in the party, continue to the next slot
      if (partyIds.has(slot.id)) {
        continue;
      }

      partyIds.add(slot.id);
      partyPoolIdxs.add(slot.idx);
      recurse(remainingScore - slot.score, partyPoolIdxs, i + 1);
      partyPoolIdxs.delete(slot.idx);
      partyIds.delete(slot.id);
    }
  };

  instr.wrap("findParty", () => {
    recurse(targetScore, partyPoolIdxs, 0);
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
