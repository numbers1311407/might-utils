export const defaultClassTags = {
  BER: ["dps", "mdps", "chain"],
  BRD: ["support", "plate"],
  BST: ["dps", "mdps", "leather", "pet", "hybrid"],
  CLR: ["healer", "plate"],
  DRU: ["healer", "leather", "ports"],
  ENC: ["support", "cloth"],
  MAG: ["dps", "rdps", "cloth", "pet"],
  MNK: ["dps", "mdps", "leather"],
  NEC: ["dps", "rdps", "cloth", "pet"],
  PAL: ["tank", "plate", "hybrid"],
  RNG: ["dps", "rdps", "chain", "hybrid"],
  ROG: ["dps", "mdps", "chain"],
  SHD: ["tank", "plate", "hybrid"],
  SHM: ["healer", "chain"],
  WAR: ["tank", "plate"],
  WIZ: ["dps", "rdps", "cloth", "ports"],
};

export const defaultTagRules = new Map([
  [
    2,
    [
      { type: "tag", value: "tank", range: 1 },
      { type: "name", value: "geese", warden: 2 },
      { type: "tag", value: "healer", range: 1 },
      { type: "tag", value: "support", range: [0, 1] },
    ],
  ],
  [6, [{ type: "tag", value: "dps", range: [2] }]],
  [7, [{ type: "tag", value: "tank", range: [1] }]],
  [
    9,
    [
      { type: "tag", value: "healer", range: [2, 3] },
      { type: "tag", value: "tank", range: 2 },
      { type: "tag", value: "dps", range: [3] },
      { type: "tag", value: "support", range: [0, 2] },
    ],
  ],
  [10, [{ type: "tag", value: "support", range: [1, 2] }]],
  [
    12,
    [
      { type: "tag", value: "dps", range: [5] },
      { type: "tag", value: "healer", range: 3 },
      { type: "tag", value: "support", range: [1] },
    ],
  ],
]);
