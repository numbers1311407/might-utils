import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Router } from "wouter";
import { AppContextProvider } from "@/core/context";
import { CalculatorContextProvider } from "@/core/calculators";
import { ModalStore } from "@/core/components";
import { GlobalConfirmationModal } from "./components/GlobalConfirmationModal.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { FloatingWindowDrawer } from "./components/FloatingWindowDrawer.jsx";
import { AppRoot } from "./AppRoot.jsx";
import { cssVariablesResolver } from "./css-variables-resolver.yellow.js";
import { theme } from "./theme.yellow.js";
import "./style.yellow.css";
import "./style-override.css";

const queryClient = new QueryClient();

export const App = () => {
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
              <AppRoot />
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
};
