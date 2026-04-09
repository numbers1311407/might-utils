import { Link, useRoute } from "wouter";
import { Stack, NavLink, Text } from "@mantine/core";
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
        <Text fw="bold" size="md" p="xs" pt={0} c="gold">
          Planning & Data
        </Text>
        <NavbarLink label="Party Generator" href="/party-generator" />
        <NavbarLink label="Instance NPC Simulator" href="/npc-simulator" />
        <NavbarLink label="Might Range Finder" href="/might-range-finder" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" c="gold">
          Team Management
        </Text>
        <NavbarLink label="Character Roster" href="/roster" />
        <NavbarLink label="Saved Parties" href="/parties" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" c="gold">
          Configuration
        </Text>
        <NavbarLink label="Generator Rules" href="/rulesets" />
        <NavbarLink label="Generator Grouping Tags" href="/tag-groups" />
        <NavbarLink label="Generator Class Tags" href="/class-tags" />
      </Stack>
    </Stack>
  );
};
