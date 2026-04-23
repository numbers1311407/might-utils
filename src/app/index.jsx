import { MantineProvider } from "@mantine/core";
import { Router } from "wouter";
import { AppContextProvider } from "@/core/context";
import { ScrollToTop } from "./ScrollToTop.jsx";
import { GlobalConfirmationModal } from "./GlobalConfirmationModal.jsx";
import { ModalStore } from "@/core/components";
import { CalculatorContextProvider } from "@/core/calculators";
import { FloatingWindowDrawer } from "./FloatingWindowDrawer.jsx";
import { theme } from "./theme.yellow.js";
import { cssVariablesResolver } from "./css-variables-resolver.yellow.js";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Shell } from "./Shell.jsx";

import "./style.yellow.css";
import "./style-override.css";

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="dark"
    >
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <Router base="/might-utils">
            <CalculatorContextProvider>
              <Shell />
              <ScrollToTop />
              <GlobalConfirmationModal />
              <ModalStore />
              <FloatingWindowDrawer />
            </CalculatorContextProvider>
          </Router>
        </AppContextProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
