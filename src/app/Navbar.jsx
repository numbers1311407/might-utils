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
      px="xs"
      py={4}
      bdrs="xs"
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
    <Stack gap={0} {...props}>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" c="gold">
          Calculators
        </Text>
        <NavbarLink
          label="Calculate Might Ranges"
          href="/instance-calculator"
        />
        <NavbarLink label="Instance NPC Simu" href="/npc-simulator" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" pt={0} c="gold">
          Might Party Finder
        </Text>
        <NavbarLink label="Find Your Party" href="/" />
        <NavbarLink label="Rulesets" href="/rulesets" />
        <NavbarLink label="Result Groups" href="/tag-groups" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" c="gold">
          Manage Your Team
        </Text>
        <NavbarLink label="Character Roster" href="/roster" />
        <NavbarLink label="Saved Parties" href="/parties" />
        <NavbarLink label="Class Tags" href="/class-tags" />
      </Stack>
    </Stack>
  );
};
