import { createStore } from "@/common/store";
import { defaultClassTags } from "./defaults.js";

export const useClassTagsStore = createStore(
  "might-utils-class-tags",
  (set) => ({
    tags: { ...defaultClassTags },
    setClassTags: (cls, clsTags) => {
      set(({ tags }) => {
        if (!tags[cls]) throw "invalid class";
        tags[cls] = clsTags ?? defaultClassTags[cls];
      });
    },
    removeClassTag: (cls, tag) => {
      set(({ tags }) => {
        if (!tags[cls]) throw "invalid class";
        tags[cls] = tags[cls].filter((t) => t !== tag);
      });
    },
    addClassTag: (cls, tag) => {
      set(({ tags }) => {
        if (!tags[cls]) throw "invalid class";
        if (tags[cls].indexOf(tag) !== -1) {
          tags[cls].push(tag);
        }
      });
    },
    clearClassTags: (cls) => {
      set(({ setClassTags }) => {
        setClassTags(cls, []);
      });
    },
    resetClassTags: (cls) => {
      set(({ setClassTags }) => {
        setClassTags(cls, undefined);
      });
    },
    resetAllClassTags: () => {
      set((state) => {
        state.tags = { ...defaultClassTags };
      });
    },
  }),
);
