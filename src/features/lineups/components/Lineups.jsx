import { LineupsControls } from "./LineupsControls.jsx";
import { LineupsContextProvider } from "./LineupsContextProvider.jsx";
import { LineupsMain } from "./LineupsMain.jsx";

export const Lineups = () => (
  <LineupsContextProvider>
    <LineupsControls />
    <LineupsMain />
  </LineupsContextProvider>
);
