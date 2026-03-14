import { ErrorBoundary } from "react-error-boundary";
import { AppShell, MantineProvider } from "@mantine/core";

import { Router } from "wouter";
import { Routes } from "./routes";
import { Header } from "./Header.jsx";
import { ErrorPage } from "./ErrorPage.jsx";
import { theme } from "./theme.js";

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Router base="/might-utils">
        <AppShell header={{ height: 85 }} padding="sm">
          <Header />
          <AppShell.Main>
            <ErrorBoundary fallback={<ErrorPage />}>
              <Routes />
            </ErrorBoundary>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}

export default App;
