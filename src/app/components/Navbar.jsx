import { Link, useRoute } from "wouter";
import { Stack, NavLink, Text } from "@mantine/core";
import { useAppContext } from "@/core/context";
import * as titles from "@/config/constants/titles";

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
        <Stack gap={2} mb="lg">
          <Text fw="bold" size="md" p="xs" pt={0} c="primary">
            {titles.PARTY_CATEGORY}
          </Text>
          <NavbarLink
            label={titles.PARTY_FINDER_TITLE}
            href="/party-generator"
          />
          <NavbarLink label={titles.PARTIES_TITLE} href="/parties" />
        </Stack>
        <Text fw="bold" size="md" p="xs" c="primary">
          {titles.ROSTER_CATEGORY}
        </Text>
        <NavbarLink
          label={titles.ROSTER_TITLE}
          className={(active) => (active ? "active" : "")}
          href="/roster/characters"
        />
        <NavbarLink
          label={titles.ROSTER_TAGS_EDITOR_TITLE}
          href="/roster/tags"
        />
        <NavbarLink label={titles.ROSTER_IO_TITLE} href="/roster/io" />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" pt={0} c="primary">
          {titles.CALCULATORS_CATEGORY}
        </Text>
        <NavbarLink label={titles.NPC_SIMULATOR_TITLE} href="/npc-simulator" />
        <NavbarLink
          label={titles.MIGHT_RANGE_FINDER_TITLE}
          href="/might-range-finder"
        />
      </Stack>
      <Stack gap={2} mb="lg">
        <Text fw="bold" size="md" p="xs" c="primary">
          {titles.SETTINGS_CATEGORY}
        </Text>
        <NavbarLink label={titles.TAG_RULES_TITLE} href="/rulesets" />
        <NavbarLink label={titles.TAG_GROUPS_TITLE} href="/tag-groups" />
        <NavbarLink label={titles.CLASS_TAGS_TITLE} href="/class-tags" />
      </Stack>
    </Stack>
  );
};
