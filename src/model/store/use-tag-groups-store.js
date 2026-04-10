import { defaultTagGroups as defaults } from "@/config/defaults";
import { tagGroupSchema } from "@/model/schemas";
import { createRegistryStore } from "./helpers";

const { useStore: useTagGroupsStore, api: useTagGroupsStoreApi } =
  createRegistryStore("might-utils-tag-groups", tagGroupSchema, { defaults });

export { useTagGroupsStore, useTagGroupsStoreApi };
