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
            it's grown into something potentially useful enough that others may
            want to try it out, and there's still a backlog of features I plan
            to add.
          </Text>
          <Text>
            Feel free to submit issues or feature requests at{" "}
            <Anchor
              target="_blank"
              href="https://github.com/numbers1311407/might-utils"
            >
              the github repo
            </Anchor>
            . No promises, but I'll do my best or let you know if it's not
            something I plan to address. Or, feel free to fork the repo, modify
            it to your needs, and run it locally or host it yourself. It's
            pretty easy to get running but I can help out if you're struggling.
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

          <Title order={3} size="h5">
            In short, the site is a set of tools to:
          </Title>

          <List type="ordered">
            <List.Item>
              Figure out might requirements with the calculators
            </List.Item>
            <List.Item>
              Find and save parties targeting specific might scores with the
              party generator
            </List.Item>
            <List.Item>
              Visualize the compositions and track the buildability status of
              your favorite parties
            </List.Item>
            <List.Item>
              Generate rulesets from your favorite parties to find similar
              compositions with different scores or characters
            </List.Item>
          </List>

          <Text component={Group} gap={2} fw="bold">
            Click the help button <IconHelp size={20} /> in the top bar to open
            a modal with contextual information and help for each page.
          </Text>

          <Divider />

          <Title order={2} size="h3" c="primary">
            Disclaimer
          </Title>

          <Text>
            Some features are incomplete (the calculators specifically are
            missing a lot data), and features are subject to change without
            warning. I will however attempt to keep things backward compatible.
          </Text>

          <Text>
            For your own sanity I suggest you use the roster import/export
            feature to at least back up your roster, just in case something
            breaks so you can re-import it easily. Things are relatively stable
            but anything is possible.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};
