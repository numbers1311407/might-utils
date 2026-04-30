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
import { IconHelp } from "@tabler/icons-react";

export const Home = () => {
  return (
    <Box>
      <Stack p="2xl" gap="lg" style={{ maxWidth: 950, margin: "0 auto" }}>
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
            it's grown into something kind of fun and potentially useful enough
            that others may want to try it out, and there's still a backlog of
            features I plan to add.
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
        </Stack>

        <Divider />

        <Stack gap="sm" component="section">
          <Title order={2} size="h3" c="primary">
            What is all this anyway?
          </Title>

          <Text>
            The core app here is an enumerator for all possible combinations of
            your characters to hit a specific warden score. Things snowballed
            from there and it's become a more complete loop.
          </Text>

          <Title order={3} size="h5">
            In short, the site is a set of tools to:
          </Title>

          <List type="ordered">
            <List.Item>
              Use the calculators to find the might score you need to target for
              your instance.
            </List.Item>
            <List.Item>
              Use custom or predefined rules to generate parties that match your
              preferences and hit that score.
            </List.Item>
            <List.Item>
              Save these, or skip this and create your own parties. Track what
              saved parties can be created with your current roster.
            </List.Item>
            <List.Item>
              Generate rules from saved parties to generate similar compositions
              with different characters or scores.
            </List.Item>
          </List>

          <Text>
            In the end it's a lot of overengineering for a non-problem but it
            was just for fun and I think it's kind of fun to use.
          </Text>

          <Text component={Group} gap={2} fw="bold">
            Click the help button <IconHelp size={20} /> in the top bar to open
            a modal with contextual information and help for each page.
          </Text>

          <Divider />

          <Title order={2} size="h3" c="primary">
            Disclaimer
          </Title>

          <Text>
            Some features are incomplete and features are subject to change
            without notice. I will however attempt to keep things backward
            compatible.
          </Text>

          <Text>
            If anyone ends up using this I suggest you use the roster
            import/export feature to at least back up your roster, just in case
            something breaks so you can re-import it easily. Things are
            relatively stable but anything is possible.
          </Text>

          <Text>
            Finally, note that this app is 100% local with no server component.
            All the data is stored in your browser in localstorage, so if you
            clear your cache you lose anything you have saved. A more complete
            import/export feature may be coming.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};
