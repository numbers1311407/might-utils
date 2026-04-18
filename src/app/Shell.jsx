import { ErrorBoundary } from "react-error-boundary";
import { AppShell, Box, Group, Container, rem } from "@mantine/core";
import { useAppContext } from "@/core/context";
import { Routes } from "./routes";
import { Header } from "./Header.jsx";
import { Navbar } from "./Navbar.jsx";
import { ErrorPage } from "./ErrorPage.jsx";
import {
  CONTAINER_WIDTH,
  HEADER_HEIGHT,
  NAVBAR_WIDTH,
  ASIDE_WIDTH,
} from "@/config/constants";

export const Shell = () => {
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
          <AppShell.Main flex="1" pb="30em">
            <ErrorBoundary fallback={<ErrorPage />}>
              <Routes />
            </ErrorBoundary>
          </AppShell.Main>
          <ErrorBoundary fallback="Error loading sidebar content">
            <Box
              component="aside"
              display={hasAside ? "block" : "none"}
              pos="sticky"
              py={0}
              right={0}
              top={HEADER_HEIGHT}
              pt={14}
              style={{ flex: `0 0 ${rem(ASIDE_WIDTH)}` }}
            >
              <Box id="aside-slot" />
            </Box>
          </ErrorBoundary>
        </Group>
      </Container>
    </AppShell>
  );
};
