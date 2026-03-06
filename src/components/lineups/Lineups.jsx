import { Layout } from "@/components/Layout.jsx";
import { LineupsControls } from "./LineupsControls.jsx";
import { LineupsContextProvider } from "./LineupsContextProvider.jsx";
import { LineupsMain } from "./LineupsMain.jsx";

export const Lineups = () => (
  <LineupsContextProvider>
    <Layout navbar={<LineupsControls />}>
      <LineupsMain />
    </Layout>
  </LineupsContextProvider>
);
