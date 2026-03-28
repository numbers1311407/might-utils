import {
  INSTANCE_MEDALS,
  DIFFICULTY_NAME_MAP,
  AURA_NAME_MAP,
} from "./constants.js";
import { capitalize, toRomanNumeral } from "@/utils";
import data from "./instance-data";

export const humanizeDifficulty = (difficulty = "") => {
  const [dchar, plusminus] = difficulty.split("");
  const dname = DIFFICULTY_NAME_MAP.get(dchar);
  return dname ? `${dname}${plusminus || ""}` : "Unknown";
};

export const humanizeAura = (aura = "") => {
  const [achar, level] = aura.split("");
  const aname = AURA_NAME_MAP.get(achar);
  return aname ? `${aname} ${toRomanNumeral(level)}` : "Unknown";
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
  const medals = [...INSTANCE_MEDALS];
  const offerings = medals.reduce(
    (acc, medal) => ({ ...acc, [medal]: null }),
    {},
  );

  medals.forEach((medal) => {
    if (!data[type]?.[medal]) return;

    // Search every difficulty in this lane
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
    .filter(([_, offering]) => offering !== null)
    .map(([medal, offering]) => ({
      medal,
      ...offering,
    }));
};

export const simulateInstanceNPC = (type, suggestedMight, partyMight) => {
  return getInstanceOfferings(type, suggestedMight, partyMight).map(
    humanizeOffering,
  );
};

// const getTargetMightRange = (
//   suggestedMight,
//   isRaid,
//   desiredDifficulty,
//   desiredAura = null,
//   smallGroupModifier = 1.0,
//   laneDictionary = RATIO_BRACKETS,
// ) => {
//   const raidModifier = isRaid ? 0.75 : 1.0;
//   const effectiveSuggested = suggestedMight * raidModifier * smallGroupModifier;

//   const validWindows = [];
//   const lanes = ["Platinum", "Gold", "Silver", "Bronze"];

//   lanes.forEach((lane) => {
//     // 1. Check if this lane even contains the desired difficulty
//     if (laneDictionary[lane] && laneDictionary[lane][desiredDifficulty]) {
//       const aurasInLane = laneDictionary[lane][desiredDifficulty];

//       // 2. If the user specified an aura, check only that one. Otherwise, check all of them!
//       const aurasToCheck = desiredAura
//         ? [desiredAura]
//         : Object.keys(aurasInLane);

//       aurasToCheck.forEach((aura) => {
//         // 3. Make sure the specific aura exists in this lane
//         if (aurasInLane[aura]) {
//           const bounds = aurasInLane[aura];
//           const minTarget = Math.floor(bounds.min * effectiveSuggested);
//           const maxTarget = Math.ceil(bounds.max * effectiveSuggested);

//           validWindows.push({
//             lane: lane,
//             aura: aura, // We now include the Aura in the return object!
//             minMight: minTarget,
//             maxMight: maxTarget,
//           });
//         }
//       });
//     }
//   });

//   return validWindows;
// };
