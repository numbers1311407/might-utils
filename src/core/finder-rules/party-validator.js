import { TagRuleTypes } from "@/model/schemas";
import { applyRule } from "./json-logic.js";

const createReporter = ({
  telemetry,
  minScore,
  maxScore,
  minSize,
  maxSize,
}) => {
  return {
    end: (event) => {
      telemetry.counts.pathEnds[event] =
        (telemetry.counts.pathEnds[event] || 0) + 1;
    },
    call: ({ currentScore, currentSize }) => {
      telemetry.counts.totalPaths++;

      const isScoreValid = currentScore >= minScore && currentScore <= maxScore;
      const isSizeValid = currentSize >= minSize && currentSize <= maxSize;

      if (isScoreValid && isSizeValid) {
        telemetry.counts.validSizeAndScore++;
      } else if (isScoreValid) {
        telemetry.counts.validScoreOnly++;
      } else if (isSizeValid) {
        telemetry.counts.validSizeOnly++;
      }
    },
  };
};

const createTester = ({ rulesBySize, validIdxsByRule, telemetry }) => {
  return (partyIdxs) => {
    let partyPassed = true;

    // get the ruleset for this party size.
    const appliedRules = rulesBySize.get(partyIdxs.size) || [];

    // otherwise every rule must pass
    for (const rule of appliedRules) {
      // get size of intersection between pool indexes of the party, and
      // those of slots that passed this rule
      const validIdxs = validIdxsByRule.get(rule);
      const validCount = validIdxs.intersection(partyIdxs).size;

      const size = partyIdxs.size;
      const [min, max] =
        rule.type === TagRuleTypes.ALL ? [size, size] : rule.value;

      const rulePassed =
        validCount >= min && (max === undefined || validCount <= max);

      if (!rulePassed) {
        const failCount = telemetry.ruleFailures.get(rule) || 0;
        telemetry.ruleFailures.set(rule, failCount + 1);
        partyPassed = false;
      }
    }

    return partyPassed;
  };
};

const createPreChecksRunner = ({
  reports,
  buckets,
  minSize,
  maxSize,
  rules,
  rulesBySize,
  validIdxsByRule,
}) => {
  const bucketPassesByRule = new Map();

  rules.forEach((rule) => {
    const passingBuckets = new Set();
    const validIdxs = validIdxsByRule.get(rule);

    buckets.forEach((bucket, idx) => {
      // If any slot in this bucket exists in the validIdxs for this rule
      const canSatisfy = bucket.some((slot) => validIdxs.has(slot.idx));

      if (canSatisfy) {
        passingBuckets.add(idx);
      }
    });

    bucketPassesByRule.set(rule, passingBuckets);
  });

  const runPreCheck = (size) => {
    const reports = [];
    const appliedRules = rulesBySize.get(size) || [];
    const totalBuckets = buckets.length;
    const unusedCapacity = totalBuckets - size;

    // If there are no rules defined for a size we will probably want to
    // warn the user if results for this size exist.
    if (appliedRules.length === 0) {
      reports.push({ size, level: "WARNING", type: "SIZE_RULES_GAP" });
    }

    // Pretest clear single rule failures
    for (const rule of appliedRules) {
      const passingBuckets = bucketPassesByRule.get(rule);
      const [min, max] =
        rule.type === TagRuleTypes.ALL ? [size, size] : rule.value;

      // If there aren't enough passing character buckets to satisfy the
      // min value then this rule cannot pass at this size.
      if (passingBuckets.size < min) {
        reports.push({
          size,
          level: "ERROR",
          type: "INSUFFICIENT_CANDIDATES",
          rule,
          details: { required: min, available: passingBuckets.size },
        });
      }

      // If rules have a max we must be sure that we can exclude enough
      // characters passing this rule to satisfy the count. For example if
      // you're looking for a group of 6 from an eligible roster of 7,
      // and 2 of those must be tanks, then you can only have 3 tanks total
      // so one can be excluded, or the rule cannot pass at this size.
      const mustExclude = Math.max(0, passingBuckets.size - (max ?? size));
      if (mustExclude > unusedCapacity) {
        reports.push({
          size,
          level: "ERROR",
          type: "EXCLUSION_IMPOSSIBLE",
          rule,
          details: { mustExclude, availableCapacity: unusedCapacity },
        });
      }
    }

    // compare the sets of rules in the same size group to see if they
    // can co-exist. Basically we're pairing up every rule at this size,
    // and calculating the count of their shared rules that would need to
    // apply for them to pass, then failing if there aren't enough passes
    // or slots in the group to fulfill it.
    for (let i = 0; i < appliedRules.length; i++) {
      for (let j = i + 1; j < appliedRules.length; j++) {
        // get each pair of rules...
        const rA = appliedRules[i];
        const rB = appliedRules[j];

        // get their mins...
        const [minA] = rA.type === TagRuleTypes.ALL ? [size] : rA.value;
        const [minB] = rB.type === TagRuleTypes.ALL ? [size] : rB.value;

        // and their passed idxs
        const setA = bucketPassesByRule.get(rA);
        const setB = bucketPassesByRule.get(rB);

        // take the union and intersction for the next steps
        const intersection = setA.intersection(setB).size;
        const union = setA.union(setB).size;

        // The combined min required is the min of each rule required to
        // pass minus the indexes that pass both. For example if rule A
        // requires 3, and rule B require 4, and 2 slots pass both, that's
        // 3 + 4 - 2 = 5 slots minimum that would be needed to fulfil both
        // rules, broken down:
        //
        // -> A needs shared 2 + 1 other, B needs shared 2 + 2 others
        // -> 2 (pass both) + 1 (pass A only) + 2 (pass B only) = 5
        const combinedMinRequired = minA + minB - intersection;

        // Then we need to compare the combined required vs how many slots
        // we actually have. If it's > size it's obviously a fail, but if
        // it's greater than the union, that means we need more passes than
        // we have total.
        const maxAvailable = Math.min(size, union);

        if (combinedMinRequired > maxAvailable) {
          reports.push({
            size,
            level: "ERROR",
            type: "SHARED_RESOURCE_CONFLICT",
            rules: [rA, rB],
            details: {
              maxAvailable,
              union,
              intersection,
              combinedMinRequired,
            },
          });
        }
      }
    }

    return reports;
  };

  return () => {
    for (let size = minSize; size <= maxSize; size++) {
      reports.push(...runPreCheck(size));
    }
  };
};

export const createPartyValidator = (rules, buckets, options = {}) => {
  const { minSize, maxSize, minScore, maxScore } = options;
  const pool = buckets.flat();

  const [validIdxsByRule, rulesBySize] = rules.reduce(
    ([validIdxsByRule, rulesBySize], rule) => {
      // validMap will track the results of every roster slot against every test
      validIdxsByRule.set(
        // so for this rule
        rule,
        // run the rule query against every slot in the pool and add the pool
        // index of those that pass to a set
        pool.reduce(
          (passingSlots, slot) =>
            applyRule(rule, slot) ? passingSlots.add(slot.idx) : passingSlots,
          new Set(),
        ),
      );

      // Map all the rules into arrays by size. When validating a party later on
      // we'll pull the rules that apply to it by fetching the array for its size
      // from this.
      for (let size = rule.size[0]; size <= rule.size[1]; size++) {
        if (!rulesBySize.has(size)) {
          rulesBySize.set(size, []);
        }
        rulesBySize.get(size).push(rule);
      }

      return [validIdxsByRule, rulesBySize];
    },
    [new Map(), new Map()],
  );

  const telemetry = {
    counts: {
      totalPaths: 0,
      pathEnds: {},
      validSizeAndScore: 0,
      validSizeOnly: 0,
      validScoreOnly: 0,
    },
    ruleFailures: new Map(),
  };

  const reports = [];

  const runPreChecks = createPreChecksRunner({
    reports,
    buckets,
    minSize,
    maxSize,
    rules,
    rulesBySize,
    validIdxsByRule,
  });

  const test = createTester({ telemetry, rulesBySize, validIdxsByRule });

  const reporter = createReporter({
    telemetry,
    minSize,
    maxSize,
    minScore,
    maxScore,
  });

  return { test, runPreChecks, reporter, telemetry, reports };
};
