import {
  Anchor,
  Badge,
  Burger,
  Container,
  AppShell,
  Divider,
  Flex,
  Title,
  Text,
} from "@mantine/core";
import { Link } from "wouter";

import { CONTAINER_WIDTH, HEADER_HEIGHT } from "@/config/constants";
import { ColorSchemeButton } from "@/core/components";
import { GithubLink } from "./GithubLink.jsx";
import classes from "./Header.module.css";

export const Header = ({ burgerOpened, onBurgerClick }) => (
  <AppShell.Header className={classes.header}>
    <Container size={CONTAINER_WIDTH}>
      <Flex
        h={HEADER_HEIGHT}
        wrap={{ base: "wrap", sm: "nowrap" }}
        align="center"
      >
        <Burger
          opened={burgerOpened}
          onClick={onBurgerClick}
          hiddenFrom="md"
          size="sm"
          mr="sm"
          ml={-4}
        />
        <Title order={1} size="h2" whitespace="nowrap" display="flex" flex="1">
          <Anchor
            component={Link}
            href="/"
            c="var(--mantine-color-text)"
            underline="never"
            inherit
            display="box"
          >
            <Flex align="baseline" gap={2}>
              <Text
                size="2xl"
                c="light-dark(var(--mantine-color-primary-4), var(--mantine-color-primary-1))"
              >
                eq
              </Text>
              <Text c="primary" size="4xl" fw="bold">
                Might
              </Text>
              <Text
                size="2xl"
                c="light-dark(var(--mantine-color-primary-4), var(--mantine-color-primary-1))"
              >
                utils
              </Text>
              <Badge
                ml={0}
                mt={-2}
                size="xs"
                bg="yellow.5"
                style={{ alignSelf: "flex-start" }}
              >
                beta
              </Badge>
            </Flex>
          </Anchor>
        </Title>
        <Text size="md" visibleFrom="sm" flex="1" ml="auto" ta="right">
          Party building utility for{" "}
          <Anchor href="https://eqmight.com">EQ Might</Anchor>
        </Text>
        <Divider orientation="vertical" mx="md" my="sm" />
        <GithubLink
          href="https://github.com/numbers1311407/might-utils"
          target="_blank"
        />
        <Divider orientation="vertical" mx="md" my="sm" />
        <ColorSchemeButton />
      </Flex>
    </Container>
  </AppShell.Header>
);
