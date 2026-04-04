import { ErrorBoundary } from "react-error-boundary";
import {
  AppShell,
  Box,
  Group,
  Container,
  rem,
  MantineProvider,
} from "@mantine/core";
import { Router } from "wouter";
import { AppContextProvider, useAppContext } from "@/core/context";
import { Routes } from "./routes";
import { Header } from "./Header.jsx";
import { Navbar } from "./Navbar.jsx";
import { ErrorPage } from "./ErrorPage.jsx";
import { ScrollToTop } from "./ScrollToTop.jsx";
import { GlobalConfirmationModal } from "./GlobalConfirmationModal.jsx";
import {
  CONTAINER_WIDTH,
  HEADER_HEIGHT,
  NAVBAR_WIDTH,
  ASIDE_WIDTH,
} from "./constants.js";

import { theme } from "./theme.js";
import { cssVariablesResolver } from "./css-variables-resolver.js";
import "./style.css";

const Shell = () => {
  const { hasAside, toggleMobileNav, mobileNavOpened } = useAppContext();

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: "md",
        collapsed: { mobile: !mobileNavOpened, desktop: true },
      }}
    >
      <Header burgerOpened={mobileNavOpened} onBurgerClick={toggleMobileNav} />
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <Container size={CONTAINER_WIDTH} px="sm">
        <Group align="flex-start" wrap="nowrap" gap="2xl">
          <Navbar
            pos="sticky"
            top={HEADER_HEIGHT}
            visibleFrom="md"
            pt={14}
            style={{ flex: `0 0 ${rem(NAVBAR_WIDTH)}` }}
          />
          <AppShell.Main flex="1">
            <ErrorBoundary fallback={<ErrorPage />}>
              <Routes />
            </ErrorBoundary>
          </AppShell.Main>
          <ErrorBoundary fallback="Error loading sidebar content">
            <Box
              component="aside"
              display={hasAside ? "block" : "none"}
              id="aside-slot"
              pos="sticky"
              py={0}
              right={0}
              top={HEADER_HEIGHT}
              pt={14}
              style={{ flex: `0 0 ${rem(ASIDE_WIDTH)}` }}
            />
          </ErrorBoundary>
        </Group>
      </Container>
    </AppShell>
  );
};

function App() {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="dark"
    >
      <AppContextProvider>
        <Router base="/might-utils">
          <Shell />
          <ScrollToTop />
          <GlobalConfirmationModal />
        </Router>
      </AppContextProvider>
    </MantineProvider>
  );
}

export default App;
