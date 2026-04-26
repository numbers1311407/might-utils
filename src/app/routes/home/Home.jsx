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
              Find and save parties with the party generator
            </List.Item>
            <List.Item>
              Visualize the composition and track the buildability status of
              your favorite parties
            </List.Item>
            <List.Item>
              Find new parties sharing the composition of previous results
              (coming soon...{" "}
              <Text span fs="italic">
                probably
              </Text>
              )
            </List.Item>
          </List>

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

          <Divider />

          <Title order={2} size="h3" c="primary">
            Some Page Explanations
          </Title>
          <Table withColumnBorders mx={-10}>
            <Table.Tbody>
              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/roster"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Your Roster
                  </AppLink>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    The roster is where you track all your characters, and is
                    the reference for the party generator and all saved parties.
                  </Text>
                  <Text mb="sm">
                    You'll want to enter all your characters, their classes,
                    levels and warden ranks, and optionally custom tags. A
                    simple import/export tool is available to help with this.
                  </Text>
                  <Text>
                    Note the roster and calculators are globally accessible as
                    draggable floating windows, toggleable via the bar at the
                    bottom of the screen. This is for quick access on different
                    pages, like adjusting roster levels while generating
                    parties.
                  </Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/parties"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Your Parties
                  </AppLink>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    Once you've found parties with the generator, you can save
                    them to recall and recreate them later.
                  </Text>
                  <Text mb="sm">
                    You can also manually create parties, bypassing the
                    generator.
                  </Text>
                  <Text mb="sm">
                    Saved parties display the total might score and information
                    on their composition, so you can use this UI as a might
                    calculator to adjust warden ranks and levels to hit specific
                    might scores.
                  </Text>
                  <Text>
                    The app will also track your party's "diff" from the current
                    roster status, and tell you if you'll need to delevel or
                    level to rebuild it, or if it can be created currently
                    solely by swapping warden rings.
                  </Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/party-generator"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Party Generator
                  </AppLink>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    Uses rules you define to find all possible parties within a
                    given might score range.
                  </Text>
                  <Text mb="sm">
                    The parties themselves are composed of score units of
                    combined level &amp; warden rank, and you can additionally
                    classify these scored slots by grouping using editable tags.
                  </Text>
                  <Text>
                    By default there are role based tags defined for this
                    purpose, e.g. "tank", "healer", and so on, but you can use
                    the grouping tags tool to edit or replace them as you like.
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/might-range-finder"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Might Range Finder
                  </AppLink>
                  <Text>(Calculator)</Text>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    The might range finder is a calculator which takes an
                    instance tier and desired difficulty, and tries to calculate
                    all the might ranges the NPCs would offer you for that
                    difficulty, and the aura buff or debuff you'd receive at
                    each.
                  </Text>
                  <Text>
                    The results contain a set of links directly to the party
                    generator to immediately try to find parties that hit a
                    might level at or near the top of each range.
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/npc-simulator"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Instance NPC Sim
                  </AppLink>
                  <Text>(Calculator)</Text>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    This calculator simulates (or at least resembles) the text
                    spoken back when you{" "}
                    <Text span ff="mono">
                      /hail
                    </Text>{" "}
                    instance offering NPCs.
                  </Text>
                  <Text mb="sm">
                    It takes an instance tier and a might score and attempts to
                    calculate what the instance NPCs will offer you at that
                    score, without having to actualy delevel or reorganize your
                    team in game to hit it.
                  </Text>
                  <Text>
                    Note the "Floating Tools" bar at the bottom of the screen.
                    The calculators and roster can be opened in floating windows
                    to make them accessible globally. The NPC sim is a special
                    case here as on the party page, it will return results for
                    the might of the party you're viewing.
                  </Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/rulesets"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Rulesets
                  </AppLink>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    Combinable sets of rules which define how you'd like the
                    party generator to organize your parties.
                  </Text>
                  <Text mb="sm">
                    For example: from group sizes 2-6 you could require 1
                    "healer" tag, or maybe for all groups you'd like to require
                    require your main tank by name, with a specific warden
                    level.
                  </Text>
                  <Text mb="sm">
                    Because the rules are largely tag based you can get creative
                    if you want to, for example you could tag characters who
                    have acquired flags/keys then have a ruleset that solely
                    filters for flagged/keyed characters.
                  </Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/tag-groups"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Tag Groups
                  </AppLink>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    Editable lists of arbitrary tags used to group and classify
                    party generator results.
                  </Text>
                  <Text mb="sm">
                    By default two role-based groups are defined as examples:
                    one with a single "dps" group, and one where "mdps" and
                    "rdps" are split. Tag groups are fully editable and can be
                    tailored to how you play.
                  </Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr valign="top">
                <Table.Td>
                  <AppLink
                    href="/class-tags"
                    style={{ whiteSpace: "nowrap" }}
                    c="primary"
                  >
                    Class Tags
                  </AppLink>
                </Table.Td>
                <Table.Td>
                  <Text mb="sm">
                    Tags automatically applied to all characters based on class,
                    utilized by the party finder for rules and results grouping.
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>
      </Stack>
    </Box>
  );
};
