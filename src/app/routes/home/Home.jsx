import {
  Anchor,
  Box,
  Divider,
  Group,
  List,
  Stack,
  Text,
  Title,
  Table,
} from "@mantine/core";
import { AppLink } from "@/core/components";
import { IconHelp } from "@tabler/icons-react";

export const Home = () => {
  return (
    <Box>
      <Stack p="2xl" gap="lg" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Title order={1} c="primary">
          EQ Might Utils{" "}
          <Text span c="var(--mantine-color-text)">
            brought to you by Sparkle Motion
          </Text>
        </Title>

        <Divider />

        <Stack gap="sm" component="section">
          <Title order={2} size="h3" c="primary">
            Welcome!
          </Title>
          <Text>
            This site was developed as a hobby project for personal use, but
            it's grown into something that at least somebody out there might
            find useful so I thought I'd share it.
          </Text>
          <Text>
            If you have questions or problems, I'm the{" "}
            <Text span c="primary">
              &lt;Sparkle Motion&gt;
            </Text>{" "}
            guild in game when I'm playing, usually driving on my tank{" "}
            <Text span c="primary">
              Geese
            </Text>
            , or on the discord as{" "}
            <Text span c="primary">
              numbers1311407
            </Text>
            .
          </Text>
          <Text>
            If any admins at EQ Might have a problem with this site please
            contact me and I'll take it down.
          </Text>
        </Stack>

        <Divider />

        <Stack gap="sm" component="section">
          <Title order={2} size="h3" c="primary">
            What is all this anyway?
          </Title>

          <Text>
            The core app here is an enumerator for all possible combinations of
            your characters to hit a specific might score. Things kind of
            snowballed from there and this is the result.
          </Text>

          <Title order={3} size="h5">
            In short, the site is a set of tools to:
          </Title>

          <List type="ordered">
            <List.Item>
              Use <AppLink href="/might-range-finder">one</AppLink> of the{" "}
              <AppLink href="/npc-simulator">two</AppLink> calculators to find
              the might score you need to target for your instance.
            </List.Item>
            <List.Item>
              Use <AppLink href="/rulesets">sets of rules</AppLink> to{" "}
              <AppLink href="/party-generator">generate parties</AppLink> that
              match your preferences and hit your target might score.
            </List.Item>
            <List.Item>
              Save these results, or just create{" "}
              <AppLink href="/parties">your own parties</AppLink>. Track which
              parties can be created with the current roster.
            </List.Item>
            <List.Item>
              Create new rules from saved parties to generate similar comps with
              different characters or scores.
            </List.Item>
          </List>

          <Divider />

          <Title order={2} size="h3" c="primary">
            GLHF
          </Title>

          <Text size="md">
            My personal guild is loaded up so you can mess around before
            committing to setting up yours. When you need to delete them, or if
            you want to bring them back for reference, there are buttons on the
            top right of <AppLink href="/roster">the roster</AppLink>.
          </Text>

          <Text component={Group} gap={2} fw="bold">
            Click the help button <IconHelp size={20} /> in the top bar to open
            a modal with contextual information and help for each page.
          </Text>

          <Divider />

          <Title order={2} size="h3" c="primary">
            Disclaimers
          </Title>

          <List spacing="xs">
            <List.Item>
              Some features are incomplete and features are subject to change
              without notice. I will however attempt to keep things backward
              compatible.
            </List.Item>

            <List.Item>
              If someone does use this, I suggest you use{" "}
              <AppLink href="/roster/io">
                the roster import/export feature
              </AppLink>{" "}
              to at least back up your roster, just in case something breaks so
              you can re-import it easily. Things are relatively stable but
              anything is possible.
            </List.Item>

            <List.Item>
              Note that this app is 100% local with no server or database. All
              the data is stored in your browser in localstorage, so if you
              clear your cache you lose anything you have saved.
            </List.Item>
          </List>
        </Stack>
      </Stack>
    </Box>
  );
};
