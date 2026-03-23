import * as tags from "@/core/tags";
// TODO the logic around warden should just live in warden.js
import {
  Warden,
  MightScoreByLevel,
  MightMaxLevel,
  MightMinLevel,
} from "@/core/config";
import { charClassSchema } from "@/core/schemas";
import { getNumberedArray } from "@/utils";

const MaxFindLineupsRecursions = 5_000_000;

const groupingTags = {
  level: getNumberedArray(MightMinLevel, MightMaxLevel).map((level) =>
    tags.t(level, { type: "level" }),
  ),
  class: charClassSchema.options.map((cls) => tags.t(cls, { type: "class" })),
  warden: ["0", "1", "2", "3", "1+"].map((warden) =>
    tags.t("", { type: "warden", warden }),
  ),
};

const sortLineups = (lineups) =>
  lineups.slice().sort((a, b) => {
    return a.size === b.size ? b.score - a.score : b.size - a.size;
  });

const sortLineup = (lineup) =>
  lineup.slice().sort((a, b) => a.name.localeCompare(b.name));

export const defaultOptions = {
  targetScore: 1250,
  minLevel: MightMinLevel,
  maxLevel: MightMaxLevel,
  minSize: 6,
  maxSize: 12,
  margin: 0,
  checkTags: true,
  distinctTagGroups: false,
};

export const findLineups = (roster, targetScore, options = {}) => {
  const {
    classTags = {},
    tagGroups,
    margin,
    maxLevel,
    minLevel,
    rules = [],
    checkTags,
    ...restOptions
  } = {
    ...defaultOptions,
    ...options,
  };

  const isCustomTagGroups = Array.isArray(tagGroups);
  const distinctTagGroups = isCustomTagGroups
    ? false
    : restOptions.distinctTagGroups;

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
  const useTagGroups = !!tagGroups?.length;

  const pool = roster
    // filter out of bounds levels
    .filter(({ level, active }) => {
      return active && level >= minLevel && level <= maxLevel;
    })
    // transform characters to "slots" which may represent the same character
    // repeatedly through warden options (and later multi tags)
    .filter((char) => {
      if (!char.class) {
        throw new Error("all roster characters must have a class property");
      }
      return true;
    })
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
            tags: [
              // note merging of class tags still happens in tag generation if the
              // classTags option is passed, but it was moved to be done ahead of time
              // here to solve some order issues in generating group tags.
              ...(classTags?.[char.class] || []),
              ...(char.tags || []),
            ],
          });
        }
      }

      return acc;
    }, [])
    // reduce to validate tag type tag grouping and inject multi-tag slot alternates
    // if the grouping is distinct (1 given tag per character per slot)
    .reduce((acc, slot) => {
      // special behavior is only required here if tagGroups is an array, meaning
      // it's an array of user-editable "tag" type tags. The other grouping
      // options (level, class, etc?) are static and guarantee 1 tag per char.
      if (!tagGroups?.length || !Array.isArray(tagGroups)) {
        return [...acc, slot];
      }

      // find the tags specified assigned to the character
      const gtags = slot.tags.filter((tag) => tagGroups.includes(tag));
      // If the character has none of the grouping tags, throw. Having at least
      // one of the tags is required so all characters can be grouped.
      if (gtags.length === 0) {
        throw new Error(
          `all characters must have at least 1 tag in the "tagGroups" option, ` +
            `found "${slot.name}" has none of [${tagGroups.join(", ")}], found [${slot.tags.join(", ")}]`,
        );
      }

      // If the character has one of the grouping tags, or the options don't specify
      // distinct tag groups, continue normally
      if (!distinctTagGroups || gtags.length === 1) {
        return [...acc, slot];
      }

      // Otherwise we need to break this character up into distinct alternate roster
      // slots, 1 per group tag.
      //
      // For context, the difference is in how you want to treat characters that are
      // assigned multiple tags. Can they represent both tags at once, or not? A realistic
      // scenario might be a mage tank. Normally a mage is DPS, but when functioning
      // as a tank you're probably using a tank pet and prioritizing heals, and perhaps
      // they should no longer count toward your "DPS" tag requirements.
      //
      // Or maybe they still do rockin DPS and can perform both "tank" and "DPS" roles
      // at once.
      //
      // If the `distinctTagGroups` option is passed, the algorithm will create two+
      // virtual roster slots for the character, each only keeping one of the grouping
      // tags and removing the others, effectively creating a roster slot for a mage
      // in this case which is a "tank" but NOT "dps", and vice-versa.
      //
      // If the `distinctTagGroups` option is NOT true. The mage will still be allowed
      // to occupy both roles. Groups that have characters with multi-tags will have
      // this reflected in their makeup, with dual characters being identified in the
      // tags, i.e. if the mage was included, the grouped comp would have a "dps/tank"
      // tagged slot.
      for (const gtag of gtags) {
        acc.push({
          ...slot,
          tags: slot.tags.filter(
            (tag) => tag === gtag || !tagGroups.includes(tag),
          ),
        });
      }
      return acc;
    }, [])
    // do one last pass here generating full tags for each slot
    .map((slot) => {
      const derivedTagGroups = isCustomTagGroups
        ? tagGroups.map(tags.t)
        : groupingTags[tagGroups];

      return {
        ...slot,
        tags: tags.generateCharacterTags(slot, {
          warden: slot.warden,
          tagGroups: derivedTagGroups,
        }),
      };
    })
    .sort((a, b) => a.score - b.score);

  // TODO consider more prechecks that could be done up front to exit early if the search is impossible,
  // i.e. impossible tag filter configurations.
  if (!pool.length) {
    throw new Error("no eligible roster members found");
  }

  if (pool[0].score <= margin) {
    throw new Error(
      `Margin must be less than minimum individual score: (${pool[0].score}), got: ${margin}`,
    );
  }

  const rulesByLineupSize = tags.prepareTagRules(rules);
  const lineups = [];
  const usedNames = new Set();

  let recursionCount = 0;

  const recurse = (remainingScore, lineup, startIndex) => {
    if (recursionCount++ >= MaxFindLineupsRecursions) {
      throw new Error("max recursions reached, try increasing specificity");
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
        if (
          rules &&
          checkTags &&
          !tags.validateTagCounts(tagCounts, rules, lineupSize)
        ) {
          return;
        }

        const lu = {
          lineup: sortLineup(lineup),
          score: targetScore - remainingScore,
          size: lineupSize,
          tags: tagCounts,
        };

        if (useTagGroups) {
          lu.group = tags.getTagGroupKey(tagCounts);
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
    lineups: sortLineups(lineups),
    params: { roster, targetScore, options },
    pool,
    recursionCount,
    rules: rulesByLineupSize,
    size: lineups.length,
    grouped: useTagGroups,
  };
};
