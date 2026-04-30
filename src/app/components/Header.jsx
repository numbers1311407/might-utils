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
import { HelpModal } from "./HelpModal.jsx";
import classes from "./Header.module.css";

const HomeLink = () => (
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
          c="light-dark(#A8A9AD, var(--mantine-color-primary-1))"
          style={{ textShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)" }}
        >
          eq
        </Text>
        <Text c="primary" size="4xl" fw="bold">
          Might
        </Text>
        <Text
          size="2xl"
          c="light-dark(#A8A9AD, var(--mantine-color-primary-1))"
          style={{ textShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)" }}
        >
          utils
        </Text>
        <Badge
          ml={0}
          mt={-2}
          size="xs"
          c="black"
          bg="rose.2"
          style={{ alignSelf: "flex-start" }}
        >
          beta
        </Badge>
      </Flex>
    </Anchor>
  </Title>
);

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
        <HomeLink />
        <Text size="md" visibleFrom="sm" flex="1" ml="auto" ta="right">
          Party building utility for{" "}
          <Anchor href="https://eqmight.com">EQ Might</Anchor>
        </Text>
        <Divider orientation="vertical" mx="md" my="sm" />
        <HelpModal />
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
