import { useCallback } from "react";
import {
  Anchor,
  Box,
  AppShell,
  Divider,
  Flex,
  Tabs,
  Title,
  Text,
} from "@mantine/core";
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
        <Title order={1} size="h2" whitespace="nowrap" display="flex" flex="1">
          <Anchor
            component={Link}
            href="/"
            c="var(--mantine-color-text)"
            underline="never"
            inherit
            display="box"
          >
            <Flex align="center" gap={6}>
              <Text size="xl" pt={4} fw="bold" c="blue.4" fs="italic">
                Suggested
              </Text>{" "}
              <Box>Might</Box>
            </Flex>
          </Anchor>
        </Title>
        <Text size="md" visibleFrom="sm" flex="1" ml="auto" ta="right">
          Party building utility for{" "}
          <Anchor href="https://eqmight.com">EQ Might</Anchor>
        </Text>
        <Divider orientation="vertical" mx="md" my="sm" />
        <ColorSchemeButton />
      </Flex>
      <Tabs {...tabProps}>
        <Tabs.List px={4}>
          <Tabs.Tab value={defaultTab}>Find Lineups</Tabs.Tab>
          <Tabs.Tab value="roster">Roster</Tabs.Tab>
          <Tabs.Tab value="class-tags">Class Tags</Tabs.Tab>
          <Tabs.Tab value="tag-rules">Tag Rules</Tabs.Tab>
          <Tabs.Tab value="tag-groups">Tag Groups</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </AppShell.Header>
  );
};
