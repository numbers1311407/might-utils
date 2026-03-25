import { Group } from "@mantine/core";
import { LineupsControls } from "./LineupsControls.jsx";
import { LineupsContextProvider } from "./LineupsContextProvider.jsx";
import { LineupsMain } from "./LineupsMain.jsx";
import { Aside } from "@/core/components";

export const Lineups = () => (
  <LineupsContextProvider>
    <LineupsMain />
    <Aside>
      <LineupsControls />
    </Aside>
  </LineupsContextProvider>
);
