import { Link, useRoute } from "wouter";
import { Box, ScrollArea, Divider, Stack, NavLink, Text } from "@mantine/core";
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

const CategoryHeading = ({ name }) => (
  <Text fw="600" size="md" px="xs" c="primary-heading">
    {name}
  </Text>
);

const Category = ({ name, children }) => {
  return (
    <Stack gap={2}>
      <CategoryHeading name={name} />
      {children}
    </Stack>
  );
};

export const Navbar = (props) => {
  return (
    <Box {...props}>
      <ScrollArea.Autosize mah="calc(100vh - 60)">
        <Stack gap="lg" pb={70}>
          <NavbarLink label="Home" href="/" />
          <Category name={titles.PARTY_CATEGORY}>
            <NavbarLink
              label={titles.PARTY_FINDER_TITLE}
              href="/party-generator"
            />
            <NavbarLink label={titles.PARTIES_TITLE} href="/parties" />
          </Category>
          <Category name={titles.CALCULATORS_CATEGORY}>
            <NavbarLink
              label={titles.MIGHT_RANGE_FINDER_TITLE}
              href="/might-range-finder"
            />
            <NavbarLink
              label={titles.NPC_SIMULATOR_TITLE}
              href="/npc-simulator"
            />
          </Category>
          <Category name={titles.ROSTER_CATEGORY}>
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
          </Category>
          <Category name={titles.SETTINGS_CATEGORY}>
            <NavbarLink label={titles.TAG_RULES_TITLE} href="/rulesets" />
            <NavbarLink label={titles.TAG_GROUPS_TITLE} href="/tag-groups" />
            <NavbarLink label={titles.CLASS_TAGS_TITLE} href="/class-tags" />
          </Category>
        </Stack>
      </ScrollArea.Autosize>
    </Box>
  );
};
