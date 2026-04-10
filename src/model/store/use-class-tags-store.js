import { createStore } from "./helpers";
import { charClassSchema, tagSchema } from "@/model/schemas";
import { defaultClassTags } from "@/config/defaults";

const isValidClass = (cls) => {
  return !!cls && charClassSchema.options.includes(cls);
};

const parseTag = (tag) => {
  return tagSchema.parse(tag);
};

const sortClassTags = (tags) => {
  return Object.entries(tags).reduce((acc, [cls, tags]) => {
    acc[cls] = [...tags].sort();
    return acc;
  }, {});
};

export const useClassTagsStore = createStore("might-utils-class-tags", () => ({
  tags: { ...sortClassTags(defaultClassTags) },
}));

const { getState: get, setState: set } = useClassTagsStore;

const api = {
  getClassTags: (cls) => {
    if (!isValidClass(cls)) throw "invalid class";
    return get().tags[cls];
  },
  setClassTags: (cls, clsTags) => {
    set(({ tags }) => {
      if (!isValidClass(cls)) throw "invalid class";
      tags[cls] = sortClassTags(
        (clsTags ?? defaultClassTags[cls]).map(parseTag),
      );
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
        tags[cls] = [...tags[cls], parseTag(tag)].sort();
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
};
export const useClassTagsStoreApi = api;
