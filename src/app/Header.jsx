import { useCallback } from "react";
import { Anchor, AppShell, Flex, Tabs, Title, Text } from "@mantine/core";
import { ColorSchemeButton } from "@/core/components";
import { useRoute, Link, useLocation } from "wouter";
import classes from "./Header.module.css";

const useTabNavigation = (defaultTab = "lineups") => {
  const [, params] = useRoute("/:page?");
  const [, navigate] = useLocation();
  const value = params?.["page"] || defaultTab;
  const onChange = useCallback(
    (tab) => {
      navigate(`/${tab !== defaultTab ? tab : ""}`);
    },
    [navigate, defaultTab],
  );

  return { value, onChange };
};

export const Header = () => {
  const defaultTab = "lineups";
  const tabProps = useTabNavigation(defaultTab);

  return (
    <AppShell.Header className={classes.header}>
      <Flex
        h="50px"
        px="md"
        wrap={{ base: "wrap", sm: "nowrap" }}
        align="center"
      >
        <Title order={1} size="h2" whitespace="nowrap">
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
        <Text
          size="md"
          visibleFrom="sm"
          align-self="bottom"
          pt={2}
          px="lg"
          flex="1"
        >
          Fan made utilities for the awesome{" "}
          <Anchor href="https://eqmight.com">EQ Might server</Anchor>
        </Text>
        <ColorSchemeButton ml="auto" />
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
