import { PillsInput, Pill } from "@mantine/core";
import { createAppStorageSliceHook } from "@/common/store";

const useClassTagsStore = createAppStorageSliceHook("classTags");

export const ClassTagsControls = () => {
  const [tags, setTags, persistTags] = useClassTagsStore();
};
