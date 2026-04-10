export const CLASSES = Object.freeze([
  { shortName: "BER", name: "Berserker" },
  { shortName: "BRD", name: "Bard" },
  { shortName: "BST", name: "Beastlord" },
  { shortName: "CLR", name: "Cleric" },
  { shortName: "DRU", name: "Druid" },
  { shortName: "ENC", name: "Enchanter" },
  { shortName: "MAG", name: "Magician" },
  { shortName: "MNK", name: "Monk" },
  { shortName: "NEC", name: "Necromancer" },
  { shortName: "PAL", name: "Paladin" },
  { shortName: "RNG", name: "Ranger" },
  { shortName: "ROG", name: "Rogue" },
  { shortName: "SHD", name: "Shadow Knight" },
  { shortName: "SHM", name: "Shaman" },
  { shortName: "WAR", name: "Warrior" },
  { shortName: "WIZ", name: "Wizard" },
]);

export const CLASS_SHORTNAMES = Object.freeze(
  CLASSES.map(({ shortName }) => shortName),
);

export const CLASS_NAMES = Object.freeze(CLASSES.map(({ name }) => name));
