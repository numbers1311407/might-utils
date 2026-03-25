import { Link, useRoute } from "wouter";
import { Box, Stack, NavLink, Text } from "@mantine/core";

const NavbarLink = (props) => {
  const [active] = useRoute(props.href);
  return (
    <NavLink
      py={4}
      p="xs"
      bdrs="md"
      component={Link}
      active={active}
      {...props}
    />
  );
};

export const Navbar = (props) => {
  return (
    <Box {...props}>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs">
          Execute
        </Text>
        <NavbarLink label="Find Squads" href="/" />
        <NavbarLink label="Saved Squads" href="/squads" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs">
          Setup
        </Text>
        <NavbarLink label="Character Roster" href="/roster" />
        <NavbarLink label="Filter Rulesets" href="/filter-rulesets" />
        <NavbarLink label="Tag Grouping" href="/tag-groups" />
        <NavbarLink label="Class Tags" href="/class-tags" />
      </Stack>
    </Box>
  );
};
