import { CLASSES } from "@/config/classes";
import { initDict } from "@/utils";

const classDict = initDict(
  CLASSES,
  (cls) => cls.name,
  (cls) => cls.shortName,
);

export const getClassName = (cls) => classDict[cls.toUpperCase()];
