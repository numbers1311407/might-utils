import { ErrorBoundary } from "react-error-boundary";
import {
  AppShell,
  Box,
  Group,
  Container,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Router } from "wouter";
import { AppContextProvider, useAppContext } from "@/core/context";
import { Routes } from "./routes";
import { Header } from "./Header.jsx";
import { Navbar } from "./Navbar.jsx";
import { ErrorPage } from "./ErrorPage.jsx";
import { ScrollToTop } from "./ScrollToTop.jsx";
import { theme } from "./theme.js";

const CONTAINER_WIDTH = 1920;
const HEADER_HEIGHT = 50;
const HEADER_CONTENT_OFFSET = HEADER_HEIGHT + 12;
const NAVBAR_WIDTH = 250;
const ASIDE_WIDTH = 316;

const Provider = ({ children }) => (
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <AppContextProvider>{children}</AppContextProvider>
  </MantineProvider>
);

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const { hasAside } = useAppContext();

  return (
    <Provider>
      <Router base="/might-utils">
        <AppShell
          p="sm"
          header={{ height: HEADER_HEIGHT }}
          aside={{
            width: ASIDE_WIDTH,
            breakpoint: "md",
            collapsed: { mobile: true, desktop: !hasAside },
          }}
          navbar={{
            width: NAVBAR_WIDTH,
            breakpoint: "md",
            collapsed: { mobile: !mobileOpened, desktop: true },
          }}
        >
          <Header burgerOpened={mobileOpened} onBurgerClick={toggleMobile} />
          <AppShell.Navbar>
            <Navbar />
          </AppShell.Navbar>
          <Container size={CONTAINER_WIDTH} px="sm">
            <Group align="flex-start" wrap="nowrap" gap="md">
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
                  id="aside-slot"
                />
              </ErrorBoundary>
            </Group>
          </Container>
        </AppShell>
        <ScrollToTop />
      </Router>
    </Provider>
  );
}

export default App;
