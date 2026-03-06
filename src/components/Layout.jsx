import { ErrorBoundary } from "react-error-boundary";
import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ColorSchemeButton } from "./ColorSchemeButton.jsx";

export const Layout = ({ children, navbar }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={
        navbar && {
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }
      }
      padding="sm"
    >
      <AppShell.Header>
        <Flex h="100%" px="md" wrap="nowrap" align="center">
          {navbar && (
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          )}
          <ColorSchemeButton style={{ marginLeft: "auto" }} />
        </Flex>
      </AppShell.Header>
      {navbar && <AppShell.Navbar p="sm">{navbar}</AppShell.Navbar>}
      <AppShell.Main>
        <ErrorBoundary
          fallback={
            <p>Whoops, something went wrong. Please try to refresh the page.</p>
          }
        >
          {children}
        </ErrorBoundary>
      </AppShell.Main>
    </AppShell>
  );
};
