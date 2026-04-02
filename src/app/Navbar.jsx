import { Link, useRoute } from "wouter";
import { Box, Stack, NavLink, Text } from "@mantine/core";
import { useAppContext } from "@/core/context";

const NavbarLink = ({ href, ...props }) => {
  const route = href === "/" ? href : href.replace(/\/?$/, "/*?");
  const [active] = useRoute(route);

  // the nav closes on route change, but its closed explicitly here
  // so it will also close on clicking current route link.
  const { closeMobileNav } = useAppContext();

  return (
    <NavLink
      py={4}
      p="xs"
      bdrs="md"
      href={href}
      component={Link}
      active={active}
      onClick={closeMobileNav}
      {...props}
    />
  );
};

export const Navbar = (props) => {
  return (
    <Box {...props}>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" pt={0} c="gold">
          Party Utils
        </Text>
        <NavbarLink label="Party Finder" href="/" />
        <NavbarLink label="Saved Parties" href="/parties" />
        <NavbarLink label="Instance Calculator" href="/instance-calculator" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" c="gold">
          Setup
        </Text>
        <NavbarLink label="Character Roster" href="/roster" />
        <NavbarLink label="Tag Rulesets" href="/tag-rulesets" />
        <NavbarLink label="Tag Groups" href="/tag-groups" />
        <NavbarLink label="Class Tags" href="/class-tags" />
      </Stack>
    </Box>
  );
};
