import {
  Anchor,
  Box,
  Burger,
  Container,
  AppShell,
  Divider,
  Flex,
  Title,
  Text,
} from "@mantine/core";
import { ColorSchemeButton } from "@/core/components";
import { Link } from "wouter";
import classes from "./Header.module.css";

export const Header = ({ burgerOpened, onBurgerClick }) => (
  <AppShell.Header className={classes.header}>
    <Container size={1920}>
      <Flex h="50px" wrap={{ base: "wrap", sm: "nowrap" }} align="center">
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
    </Container>
  </AppShell.Header>
);
