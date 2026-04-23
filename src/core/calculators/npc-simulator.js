import {
  INSTANCE_MEDALS,
  DIFFICULTY_NAME_MAP,
  AURA_NAME_MAP,
} from "./calculator-constants.js";
import data from "@/assets/instance-data.csv";

import { capitalize, toRomanNumeral, initDict } from "@/utils";

export const humanizeDifficulty = (difficulty = "") => {
  const [dchar, plusminus] = difficulty.split("");
  const dname = DIFFICULTY_NAME_MAP.get(dchar);
  return dname ? `${dname}${plusminus || ""}` : "Unknown";
};

export const humanizeAura = (aura = "") => {
  let aname = AURA_NAME_MAP.get(aura);
  if (aname) return aname;

  const [achar, level] = [aura[0], aura.slice(1)];
  aname = AURA_NAME_MAP.get(achar);

  return aname && level ? `${aname} ${toRomanNumeral(level)}` : "Unknown";
};

export const humanizeOffering = ({ medal, difficulty, aura }) => {
  const medalName = capitalize(medal);

  if (difficulty && medalName) {
    return `${medalName}: ${humanizeDifficulty(difficulty)}, ${humanizeAura(aura)}`;
  } else {
    return `${medalName}: No offering`;
  }
};

export const getInstanceOfferings = (type, suggestedMight, partyMight) => {
  const ratio = partyMight / suggestedMight;
  const offerings = initDict(INSTANCE_MEDALS, null);

  INSTANCE_MEDALS.forEach((medal) => {
    if (!data[type]?.[medal]) return;

    // Search every difficulty in this medal
    for (const diff in data[type][medal]) {
      const auras = data[type][medal][diff];

      // Search every aura in this difficulty
      for (const aura in auras) {
        const bounds = auras[aura];
        // Does the player's ratio fall safely inside the known bounds?
        // Add a tiny buffer to account for floating point weirdness.
        if (ratio >= bounds.min - 0.0001 && ratio <= bounds.max + 0.0001) {
          offerings[medal] = { difficulty: diff, aura };
          // break after match for this medal is found
          break;
        }
      }
      if (offerings[medal] !== null) break;
    }
  });

  return Object.entries(offerings)
    .filter(([, offering]) => offering !== null)
    .map(([medal, offering]) => ({
      medal,
      ...offering,
    }));
};

export const simulateInstanceNPC = (type, suggestedMight, partyMight, tier) => {
  const offerings = getInstanceOfferings(type, suggestedMight, partyMight);
  return offerings.map((offering) => {
    return `[${tier} ${capitalize(type)} ${humanizeOffering(offering).replace(":", "]")}`;
  });
};

export const getTargetMightRanges = (
  type,
  suggestedMight,
  desiredDiff,
  desiredAura = null,
) => {
  const ranges = [];

  INSTANCE_MEDALS.forEach((medal) => {
    if (data[type]?.[medal]?.[desiredDiff]) {
      const medalAuras = data[type][medal][desiredDiff];

      const checkedAuras = desiredAura
        ? [desiredAura]
        : Object.keys(medalAuras);

      checkedAuras.forEach((aura) => {
        if (medalAuras[aura]) {
          const bounds = medalAuras[aura];
          const minMight = Math.ceil(bounds.min * suggestedMight);
          const maxMight = Math.floor(bounds.max * suggestedMight);

          ranges.push({
            medal,
            aura,
            minMight,
            maxMight,
          });
        }
      });
    }
  });

  return ranges;
};
