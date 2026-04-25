import { MightMaxLevel, MightMinLevel } from "@/config";
import {
  createPartyValidator,
  expandRoster,
  FindPartiesError,
} from "@/core/party-finder";
import { instrument } from "@/utils";
import { createComp, createTagsComp } from "@/model/schemas/comp";

export const MAX_RECURSIONS = 10_000_000;
export const MAX_RESPONSE_LENGTH = 5000;

export const defaultOptions = {
  targetScore: 1250,
  minLevel: MightMinLevel,
  maxLevel: MightMaxLevel,
  minSize: 6,
  maxSize: 12,
  margin: 0,
  sort: "-score mightSD mightRange -mightAvg",
};

export const findParties = (roster, targetScore, options = {}) => {
  const instr = instrument();

  const {
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

  const maxScore = targetScore;
  const minScore = targetScore - margin;
  const minSize = restOptions.size || restOptions.minSize;
  const maxSize = restOptions.size || restOptions.maxSize;
  const groupTags = Array.isArray(groupBy) ? groupBy : [];
  const compType = Array.isArray(groupBy) ? "tags" : "comp";

  instr.start("setupPool");

  const { buckets, pool } = expandRoster(roster, {
    minLevel,
    maxLevel,
    groupTags,
  });

  if (buckets.length < minSize) {
    throw new FindPartiesError(
      "The search configuration applied to roster didn't result in enough characters to " +
        `satisfy the query. There were ${buckets.length} eligible characters found, but ` +
        `the min party size is ${minSize}.`,
      "POOL_SIZE",
      { eligible: buckets.length, available: minSize },
    );
  }

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

  instr.start("validatorCreate");
  const validator = createPartyValidator(rules, buckets, {
    minSize,
    maxSize,
    minScore,
    maxScore,
  });
  instr.end("validatorCreate");

  instr.start("validatorPrechecks");
  validator.runPreChecks();
  instr.end("validatorPrechecks");

  if (!validator.status.isPossible) {
    throw new FindPartiesError(
      "It is impossible to create the minimum sized group with the given rules.",
      "RESULTS_IMPOSSIBLE",
      validator.reports,
    );
  }

  if (pool[0].score <= margin) {
    throw new FindPartiesError(
      `Margin must be less than minimum individual score of ${pool[0].score}, received ${margin}.`,
      "MARGIN_TOO_SMALL",
      validator.reports,
    );
  }

  const sortParty = (idxs) => {
    return idxs.sort((a, b) => pool[a].name.localeCompare(pool[b].name));
  };

  // NOTE this is the parties array in the response
  const parties = [];

  // individual responsese don't repeat data, they return arrays containing indexes of
  // the pool array
  const partyPoolIdxs = new Set();

  const getCurrentParty = () => {
    return Array.from(partyPoolIdxs).map((idx) => pool[idx]);
  };

  const createPartyComp = () => {
    const party = getCurrentParty();

    if (compType === "tags") {
      return createTagsComp(party, groupBy);
    }

    return createComp(party);
  };

  let recursionCount = 0;

  const recurse = (remainingScore, bucketIndex) => {
    if (parties.length >= MAX_RESPONSE_LENGTH) {
      validator.reporter.end("maxResponseLength");
      return;
    }

    if (recursionCount++ >= MAX_RECURSIONS) {
      throw new FindPartiesError(
        `Max recursions reached (${MAX_RECURSIONS.toLocaleString()}) trying to assemble ` +
          "the parties. Try adding more rules or reducing your roster size.",
        "MAX_RECURSIONS",
        validator.reports,
      );
    }

    const partySize = partyPoolIdxs.size;

    validator.reporter.call({
      currentScore: targetScore - remainingScore,
      currentSize: partySize,
    });

    if (
      remainingScore >= 0 &&
      remainingScore <= margin &&
      partySize >= minSize &&
      partySize <= maxSize
    ) {
      if (!validator.test(partyPoolIdxs)) {
        validator.reporter.end("ruleFailure");
        return;
      }

      parties.push({
        party: sortParty(new Uint8Array(partyPoolIdxs)),
        comp: createPartyComp(),
        score: targetScore - remainingScore,
      });

      validator.reporter.end("partyFound");
      return;
    }

    if (bucketIndex >= buckets.length) {
      validator.reporter.end("rosterExhausted");
      return;
    }

    if (partyPoolIdxs.size >= maxSize) {
      validator.reporter.end("sizeExceeded");
      return;
    }

    if (remainingScore <= 0) {
      validator.reporter.end("scoreExceeded");
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

    if (remainingMin > remainingScore) {
      validator.reporter.end("branchHigh");
      return;
    }

    if (remainingMax < minRemainingScore) {
      validator.reporter.end("branchLow");
      return;
    }

    const charBucket = buckets[bucketIndex];

    for (let i = 0; i < charBucket.length; i++) {
      const slot = charBucket[i];

      if (slot.score > remainingScore) {
        break;
      }

      partyPoolIdxs.add(slot.idx);
      recurse(remainingScore - slot.score, bucketIndex + 1);
      partyPoolIdxs.delete(slot.idx);
    }

    validator.reporter.end("pathComplete");
    recurse(remainingScore, bucketIndex + 1);
  };

  instr.wrap("findParty", () => {
    recurse(targetScore, 0);
  });

  // If there are no parties inspect the telemetry to see if there's anything unusual and if
  // not, throw an error with any reports if any exist.
  //
  // TODO this would also be a good spot to check for unusual telemetry data even in there ARE
  // results to warn/advise on how to improve or fix the search params.
  if (!parties.length) {
    const { counts } = validator.telemetry;

    // Checking for imopssible high and low scores here which isn't much but it's a start and
    // covers an easy to miss case.
    if (counts.pathEnds.branchLow === counts.totalPaths) {
      throw new FindPartiesError(
        "Your search is failing immediately because the target might score is higher than " +
          "the resolved eligible roster can possibly fill. Ensure your desired roster " +
          "characters are active and the min/max party size and level options are correct.",
        "TARGET_SCORE_HIGH",
        validator.telemetry,
      );
    }

    if (counts.pathEnds.branchHigh === counts.totalPaths) {
      throw new FindPartiesError(
        "Your search is failing immediately because the target might score is lower than " +
          "the resolved eligible roster can possibly fill. Ensure your desired roster " +
          "characters are active and the min/max party size and level options are correct.",
        "TARGET_SCORE_LOW",
        validator.telemetry,
      );
    }

    const errorCount = validator.reports.filter(
      (r) => r.level === "ERROR",
    ).length;

    if (errorCount) {
      throw new FindPartiesError(
        "No results were found and errors were reported in the rules evaluation. " +
          "Inspect your search options, rules, and roster for issues.",
        "RESULTS_PREVENTED",
        validator.reports,
      );
    }
  }

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
    parties,
    params: { roster, targetScore, options },
    pool,
    size: parties.length,
    compType,
    analytics: {
      telemetry: validator.telemetry,
      reports: validator.reports,
      timing: instr.finish(),
      validatorStatus: validator.status,
    },
  };
};
