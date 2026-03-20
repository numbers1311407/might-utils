import { defaultTagGroups as defaults } from "@/core/config/defaults";
import { tagGroupSchema } from "@/core/schemas";
import { createRegistryStore } from "./helpers";

const { useStore: useTagGroupsStore, api: useTagGroupsStoreApi } =
  createRegistryStore("might-utils-tag-groups", tagGroupSchema, { defaults });

export { useTagGroupsStore, useTagGroupsStoreApi };
