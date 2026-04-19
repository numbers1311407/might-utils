import { useMemo } from "react";
import { useRoster } from "@/core/hooks";
import { useParty } from "@/core/hooks";
import { round } from "@/utils";

const M_LEVEL_UP = 100;
const M_LEVEL_DOWN = 10;
const MAX_WARDEN_RATIO = 5;
const BASE_OVER_LEVEL = MAX_WARDEN_RATIO * 100;
const BASE_UNDER_LEVEL = 1000;

export const usePartyDiff = (partyId) => {
  const { party } = useParty(partyId, { classTags: false });
  const roster = useRoster({ activeOnly: false });

  return useMemo(() => {
    return getPartyDiff(party, roster);
  }, [party, roster]);
};

const emptyResponse = {
  log: [],
  mightDiff: 0,
  ready: "READY",
  score: 0,
  tier: undefined,
  status: {},
  warden: {
    party: 0,
    roster: 0,
    ratio: 0,
  },
};

export const getPartyDiff = (party, roster) => {
  const { might: partyMight, chars } = party;

  let dOver = 0;
  let dUnder = 0;
  let rosterMight = 0;
  let partyWardenRanks = 0;
  let rosterWardenRanks = 0;
  let hasInvalidWarden = false;

  const status = {};
  const diffLog = [];
  const missingChars = [];

  chars.forEach((char) => {
    const rosterChar = roster.find((c) => c.name === char.name);

    if (!rosterChar) {
      missingChars.push(char.name);
      return;
    }

    const diff = rosterChar.level - char.level;
    const wdiff = rosterChar.warden - char.warden;

    status[char.name] = {
      pl: char.level,
      rl: rosterChar.level,
      ld: diff,
      pw: char.warden,
      rw: rosterChar.warden,
      wd: wdiff < 0 ? wdiff : 0,
    };

    rosterMight += rosterChar.might;
    rosterWardenRanks += rosterChar.warden;
    partyWardenRanks += char.warden;

    // Diff is < 0 it means the party level is OVER the roster level
    // and the roster is underleveled. Besides being invalid this is the
    // most significant error state.
    if (diff < 0) {
      dOver -= diff;
      diffLog.push({
        type: "LEVEL_UNDER",
        char: char.name,
        diff: -diff,
        level: char.level,
      });
    } else if (diff > 0) {
      dUnder += diff;
      diffLog.push({
        type: "LEVEL_OVER",
        char: char.name,
        diff,
        level: char.level,
      });
    } else if (wdiff < 0) {
      hasInvalidWarden = true;
      diffLog.push({
        type: "WARDEN_UNDER",
        char: char.name,
        diff: -wdiff,
        warden: char.warden,
      });
    }
  });

  // Calculate final sort score
  let finalScore = 0;
  let tier = "READY";

  const wardenRatio = Math.min(
    round(partyWardenRanks / rosterWardenRanks, 2),
    MAX_WARDEN_RATIO,
  );

  if (missingChars.length) {
    return {
      ...emptyResponse,
      tier: "INVALID_ROSTER",
      missing: missingChars,
      score: 1000000,
    };
  }

  if (dOver > 0) {
    tier = "LEVEL_UNDER";
    finalScore = BASE_UNDER_LEVEL + dOver * M_LEVEL_UP + dUnder * M_LEVEL_DOWN;
  } else if (dUnder > 0) {
    tier = "LEVEL_OVER";
    finalScore = BASE_OVER_LEVEL + dUnder * M_LEVEL_DOWN;
  } else if (hasInvalidWarden) {
    tier = "WARDEN_UNDER";
    finalScore = round(wardenRatio * 100, 2);
  }

  return {
    ...emptyResponse,
    log: diffLog,
    mightDiff: rosterMight - partyMight,
    ready: tier === "READY",
    score: finalScore,
    tier,
    status,
    warden: {
      party: partyWardenRanks,
      roster: rosterWardenRanks,
      ratio: wardenRatio,
    },
  };
};
