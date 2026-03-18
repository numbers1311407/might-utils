import { ErrorBoundary } from "react-error-boundary";
import { AppShell, MantineProvider } from "@mantine/core";

import { Router } from "wouter";
import { Routes } from "./routes";
import { Header } from "./Header.jsx";
import { ErrorPage } from "./ErrorPage.jsx";
import { ScrollToTop } from "./ScrollToTop.jsx";
import { theme } from "./theme.js";
import classes from "./index.module.css";

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Router base="/might-utils">
        <AppShell
          header={{ height: 85 }}
          padding="sm"
          classNames={{
            header: classes.header,
            main: classes.main,
          }}
        >
          <Header />
          <AppShell.Main>
            <ErrorBoundary fallback={<ErrorPage />}>
              <Routes />
            </ErrorBoundary>
          </AppShell.Main>
        </AppShell>
        <ScrollToTop />
      </Router>
    </MantineProvider>
  );
}

export default App;
