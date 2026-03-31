import { ErrorBoundary } from "react-error-boundary";
import {
  AppShell,
  Box,
  Group,
  Container,
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

import { theme } from "./theme.js";
import { cssVariablesResolver } from "./css-variables-resolver.js";
import "./style.css";

const CONTAINER_WIDTH = 1600;
const HEADER_HEIGHT = 50;
const HEADER_CONTENT_OFFSET = HEADER_HEIGHT + 12;
const NAVBAR_WIDTH = 200;
const ASIDE_WIDTH = 260;

const Shell = () => {
  const { hasAside, toggleMobileNav, mobileNavOpened } = useAppContext();

  return (
    <AppShell
      p="sm"
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
        <Group align="flex-start" wrap="nowrap" gap="lg">
          <Navbar
            pos="sticky"
            top={HEADER_CONTENT_OFFSET}
            visibleFrom="md"
            w={NAVBAR_WIDTH}
          />
          <AppShell.Main flex="1">
            <ErrorBoundary fallback={<ErrorPage />}>
              <Routes />
            </ErrorBoundary>
          </AppShell.Main>
          <ErrorBoundary fallback="Error loading sidebar content">
            <Box
              component="aside"
              pos="sticky"
              top={HEADER_CONTENT_OFFSET}
              right={0}
              w={ASIDE_WIDTH}
              display={hasAside ? "block" : "none"}
              id="aside-slot"
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
