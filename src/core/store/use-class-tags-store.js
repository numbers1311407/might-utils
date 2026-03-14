import { createStore } from "@/utils";
import { defaultClassTags } from "@/core/config/defaults";

export const useClassTagsStore = createStore(
  "might-utils-class-tags",
  (set, get) => ({
    tags: { ...defaultClassTags },
    setClassTags: (cls, clsTags) => {
      set(({ tags }) => {
        if (!tags[cls]) throw "invalid class";
        tags[cls] = clsTags ?? [...defaultClassTags[cls]];
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
        if (tags[cls].indexOf(tag) === -1) {
          tags[cls].push(tag);
        }
      });
    },
    resetClassTags: (cls) => {
      get().setClassTags(cls, undefined);
    },
    resetAllClassTags: () => {
      set((state) => {
        state.tags = { ...defaultClassTags };
      });
    },
  }),
);
