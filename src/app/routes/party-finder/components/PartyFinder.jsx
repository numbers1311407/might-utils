import { PartyFinderControls } from "./PartyFinderControls.jsx";
import { PartyFinderContextProvider } from "./PartyFinderContextProvider.jsx";
import { PartyFinderMain } from "./PartyFinderMain.jsx";
import { Aside } from "@/core/components";

export const PartyFinder = () => (
  <PartyFinderContextProvider>
    <PartyFinderMain />
    <Aside>
      <PartyFinderControls />
    </Aside>
  </PartyFinderContextProvider>
);
