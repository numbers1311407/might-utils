import { useCallback } from "react";
import { Anchor, AppShell, Flex, Tabs, Title } from "@mantine/core";
import { ColorSchemeButton } from "@/core/components";
import { useRoute, Link, useLocation } from "wouter";

const useTabNavigation = (defaultTab = "lineups") => {
  const [, params] = useRoute("/:page?");
  const [, navigate] = useLocation();
  const value = params?.["page"] || defaultTab;
  const onChange = useCallback(
    (tab) => {
      navigate(`/${tab !== defaultTab ? tab : ""}`);
    },
    [navigate],
  );

  return { value, onChange };
};

export const Header = () => {
  const defaultTab = "lineups";
  const tabProps = useTabNavigation(defaultTab);

  return (
    <AppShell.Header>
      <Flex h="50px" px="md" wrap="nowrap" align="center">
        <Title order={1} size="h2">
          <Anchor
            component={Link}
            href="/"
            c="var(--mantine-color-text)"
            underline="never"
            inherit
          >
            Might Utils
          </Anchor>
        </Title>
        <ColorSchemeButton style={{ marginLeft: "auto" }} />
      </Flex>
      <Tabs {...tabProps}>
        <Tabs.List px={4}>
          <Tabs.Tab value={defaultTab}>Find Lineups</Tabs.Tab>
          <Tabs.Tab value="roster">Roster</Tabs.Tab>
          <Tabs.Tab value="class-tags">Class Tags</Tabs.Tab>
          <Tabs.Tab value="tag-rules">Tag Rules</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </AppShell.Header>
  );
};
