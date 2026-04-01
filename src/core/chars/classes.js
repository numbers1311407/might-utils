export const getClassName = (cls) => {
  return {
    BER: "Berserker",
    BRD: "Bard",
    BST: "Beastlord",
    CLR: "Cleric",
    DRU: "Druid",
    ENC: "Enchanter",
    MAG: "Magician",
    MNK: "Monk",
    NEC: "Necromancer",
    PAL: "Paladin",
    RNG: "Ranger",
    ROG: "Rogue",
    SHD: "Shadowknight",
    SHM: "Shaman",
    WAR: "Warrior",
    WIZ: "Wizard",
  }[cls.toUpperCase()];
};
