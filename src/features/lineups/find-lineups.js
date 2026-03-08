import * as tags from "@/common/tags";
// import { getNumberedArray } from "@/utils";
// TODO the logic around warden should just live in warden.js
import { Warden } from "@/common/warden";
import {
  MightScoreByLevel,
  MightMaxLevel,
  MightMinLevel,
} from "@/common/might";

const MaxFindLineupsRecursions = 5_000_000;

const sortLineups = (lineups) =>
  lineups.slice().sort((a, b) => {
    return a.size === b.size ? b.score - a.score : b.size - a.size;
  });

const sortLineup = (lineup) =>
  lineup.slice().sort((a, b) => a.name.localeCompare(b.name));

const getTagGroupKey = (tagCounts) => {
  return Object.entries(tagCounts)
    .filter(([tag]) => tag.startsWith("g-"))
    .map(([tag, count]) => [tag.replace(/^g-/, ""), count].join(":"))
    .sort()
    .join(";");
};

export const defaultOptions = {
  targetScore: 1250,
  minLevel: MightMinLevel,
  maxLevel: MightMaxLevel,
  minSize: 6,
  maxSize: 12,
  margin: 0,
  checkTags: true,
  tagGroups: ["rdps", "mdps", "support", "tank", "healer"].map(tags.t),
  // tagGroups: getNumberedArray(MightMinLevel, MightMaxLevel).map((lvl) =>
  //   tags.t(lvl, { type: "level" }),
  // ),
  // tagGroups: Object.keys(tags.getDefaultClassTags()).map((cls) =>
  //   tags.t(cls, { type: "class" }),
  // ),
  rules: tags.defaultTagRules,
  classTags: tags.defaultClassTags,
};

export const findLineups = (roster, targetScore, options = {}) => {
  const {
    classTags,
    margin,
    maxLevel,
    minLevel,
    rules,
    checkTags,
    tagGroups,
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
    throw "Invalid call: Roster and targetScore required";
  }

  const minSize = restOptions.size || restOptions.minSize;
  const maxSize = restOptions.size || restOptions.maxSize;
  const useTagGroups = !!tagGroups?.length;

  const pool = roster
    // filter out of bounds levels
    .filter(({ level, active }) => {
      return active && level >= minLevel && level <= maxLevel;
    })
    .filter((char) => {
      // TODO better validation (and/or more flexibility) for roster characters.
      if (!char.class) {
        throw "all roster characters must have a class property";
      }
      return true;
    })
    // reduce to object array and inject warden options
    .reduce((acc, char) => {
      const level = char.level;
      const score = MightScoreByLevel[level];

      for (const rank of Warden.Ranks) {
        const { rank: warden, requiredLevel, mightMultiplier } = rank;
        if (char.warden >= warden && level >= requiredLevel) {
          acc.push({
            ...char,
            score: score * mightMultiplier,
            warden,
            tags: tags.generateCharacterTags(char, {
              warden,
              classTags,
              tagGroups,
            }),
          });
        }
      }

      return acc;
    }, [])
    .sort((a, b) => a.score - b.score);

  // TODO consider more prechecks that could be done up front to exit early if the search is impossible,
  // i.e. impossible tag filter configurations.
  if (!pool.length) {
    throw "Arguments resulted in no characters";
  }

  if (pool[0].score <= margin) {
    throw `Margin must be less than minimum individual score: (${pool[0].score}), got: ${margin}`;
  }

  const rulesByLineupSize = tags.prepareTagRules(maxSize, rules);
  const lineups = [];
  const usedNames = new Set();

  let recursionCount = 0;

  const recurse = (remainingScore, lineup, startIndex) => {
    if (recursionCount++ >= MaxFindLineupsRecursions) {
      throw "max recursions reached, try increasing specificity";
    }

    // TODO prune by checking early whether the sum of the highest possible score for each roster
    // member remaining even adds up to the desired score.
    const lineupSize = lineup.length;
    const rules = rulesByLineupSize[lineupSize];

    if (remainingScore >= 0 && remainingScore <= margin) {
      // and the lineup size is not too short or too long
      if (lineupSize >= minSize && lineupSize <= maxSize) {
        const tagCounts = tags.generateTagCounts(lineup);

        // and the lineups is valid re: tags
        if (rules && checkTags && !tags.validateTagCounts(tagCounts, rules)) {
          return;
        }

        const lu = {
          lineup: sortLineup(lineup),
          score: targetScore - remainingScore,
          size: lineupSize,
          tags: tagCounts,
        };

        if (useTagGroups) {
          lu.group = getTagGroupKey(tagCounts);
        }

        // push the completed linup and end this branch
        lineups.push(lu);
      }

      return;
    }

    if (lineupSize >= maxSize || remainingScore < 0) {
      return;
    }

    for (let i = startIndex; i < pool.length; i++) {
      const slot = pool[i];

      if (slot.score > remainingScore) {
        break;
      }

      if (usedNames.has(slot.name)) {
        continue;
      }

      usedNames.add(slot.name);
      lineup.push(slot);
      recurse(remainingScore - slot.score, lineup, i + 1);
      lineup.pop();
      usedNames.delete(slot.name);
    }
  };

  recurse(targetScore, [], 0);

  return {
    // TODO ideally we'd sort in the and have options
    lineups: sortLineups(lineups),
    params: { roster, targetScore, options },
    pool,
    recursionCount,
    rules: rulesByLineupSize,
    size: lineups.length,
    grouped: useTagGroups,
  };
};
