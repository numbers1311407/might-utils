export const defaultClassTags = {
  BER: ["dps", "mdps", "chain"],
  BRD: ["support", "plate", "melee"],
  BST: ["dps", "mdps", "leather", "melee", "pet"],
  CLR: ["healer", "plate"],
  DRU: ["healer", "leather"],
  ENC: ["support", "cloth"],
  MAG: ["dps", "rdps", "cloth", "pet"],
  MNK: ["dps", "mdps", "leather", "melee"],
  NEC: ["dps", "rdps", "cloth", "pet"],
  PAL: ["tank", "plate", "melee"],
  RNG: ["dps", "rdps", "chain"],
  ROG: ["dps", "mdps", "chain"],
  SHD: ["tank", "plate", "melee"],
  SHM: ["healer", "chain"],
  WAR: ["tank", "plate", "melee"],
  WIZ: ["dps", "rdps", "cloth"],
};

export const defaultTagRules = {
  2: [
    { type: "name", value: "geese", warden: 2 },
    { type: "tag", value: "tank", range: 1 },
    { type: "tag", value: "healer", range: 1 },
    { type: "name", value: "phatos", warden: 0 },
  ],
  5: [
    { type: "tag", value: "healer", range: 2 },
    { type: "tag", value: "support", range: [0, 1] },
  ],
  6: [{ type: "tag", value: "dps", range: 2 }],
  9: [
    { type: "tag", value: "healer", range: [0, 1] },
    { type: "tag", value: "tank", range: 2 },
    { type: "tag", value: "dps", range: [4] },
    { type: "tag", value: "support", range: [2] },
  ],
  12: [
    { type: "tag", value: "dps", range: [5] },
    { type: "tag", value: "healer", range: 3 },
  ],
};
