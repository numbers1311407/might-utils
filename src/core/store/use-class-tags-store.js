import { createStore } from "./helpers";
import { charClassSchema, tagSchema } from "@/core/schemas";
import { defaultClassTags } from "@/core/config/defaults";

const isValidClass = (cls) => {
  return !!cls && charClassSchema.options.includes(cls);
};

const parseTag = (tag) => {
  return tagSchema.parse(tag);
};

export const useClassTagsStore = createStore(
  "might-utils-class-tags",
  (set, get) => ({
    tags: { ...defaultClassTags },
    getClassTags: (cls) => {
      if (!isValidClass(cls)) throw "invalid class";
      return get().tags[cls];
    },
    setClassTags: (cls, clsTags) => {
      set(({ tags }) => {
        if (!isValidClass(cls)) throw "invalid class";
        tags[cls] = (clsTags ?? [...defaultClassTags[cls]]).map(parseTag);
      });
    },
    removeClassTag: (cls, tag) => {
      set(({ tags }) => {
        if (!isValidClass(cls)) throw "invalid class";
        tags[cls] = tags[cls].filter((t) => t !== tag);
      });
    },
    addClassTag: (cls, tag) => {
      set(({ tags }) => {
        if (!isValidClass(cls)) throw "invalid class";
        if (tags[cls].indexOf(tag) === -1) {
          tags[cls].push(parseTag(tag));
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
