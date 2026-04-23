export const CALCULATOR_DEFAULT_DIFFICULTY = "N";
export const CALCULATOR_DEFAULT_MIGHT = 1600;

export const CALCULATOR_DEFAULT_INSTANCE = {
  tier: "T9",
  type: "raid",
  might: 1600,
  maxIntense: 768,
};

export const CALCULATOR_INTENSE_MULT_GROUP = 0.64;
export const CALCULATOR_INTENSE_MULT_RAID = 0.48;

export const AURA_NAME_MAP = new Map([
  ["F", "Aura of Frailty"],
  ["M", "Aura of Might"],
  ["I", "Aura of Intensity"],
  ["NA", "No Aura"],
]);

export const DIFFICULTY_NAME_MAP = new Map([
  ["T", "Trivial"],
  ["E", "Easy"],
  ["N", "Normal"],
  ["H", "Hard"],
  ["I", "Intense"],
]);

export const INSTANCE_TYPES = Object.freeze(["group", "raid", "solo", "trio"]);

export const INSTANCE_MEDALS = Object.freeze([
  "bronze",
  "silver",
  "gold",
  "platinum",
]);
