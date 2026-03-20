import { createRegistryStore } from "./helpers";
import { lineupSchema } from "@/core/schemas";

const { useStore: useSavedLineupsStore, api: useSavedLineupsStoreApi } =
  createRegistryStore("might-utils-saved-lineups", lineupSchema);

export { useSavedLineupsStore, useSavedLineupsStoreApi };
