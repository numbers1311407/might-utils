import { MightMinLevel, MightMaxLevel, CLASS_SHORTNAMES } from "@/core/config";
import { getNumberedArray } from "@/utils";
import { formatTag } from "./tags.js";

export const levelTags = getNumberedArray(MightMinLevel, MightMaxLevel).map(
  (level) => formatTag(level, { type: "level" }),
);

export const classTags = CLASS_SHORTNAMES.map((cls) =>
  formatTag(cls, { type: "class" }),
);

export const wardenTags = ["0", "1", "2", "3"].map((warden) =>
  formatTag("", { type: "warden", warden }),
);
