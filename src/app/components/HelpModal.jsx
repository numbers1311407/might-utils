import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import {
  Alert,
  Anchor,
  Title,
  Text,
  Modal,
  Divider,
  List,
  Grid,
  ActionIcon,
  Stack,
  TableOfContents,
  ScrollArea,
} from "@mantine/core";
import { IconHelp as IconHelp } from "@tabler/icons-react";
import * as tls from "@/config/constants/titles";

export const HelpModal = () => {
  const [opened, setOpened] = useState(false);
  const [scrollHost, setScrollHost] = useState();

  return (
    <>
      <Modal
        size="90vw"
        id="help-modal"
        title="Global Help"
        opened={opened}
        styles={{ content: { maxWidth: "1250px" } }}
        onClose={() => setOpened(false)}
      >
        <Grid p="lg" flex="1">
          <Grid.Col span={{ base: 12, md: 9 }}>
            <ScrollArea.Autosize mah="80vh" viewportRef={setScrollHost}>
              <Stack gap={70} pb="75vh" pr={25}>
                <PartyFinder />
                <Parties />
                <Roster />
                <RosterTags />
                <RosterIO />
                <NpcSimulator />
                <MightRangeFinder />
                <TagRules />
                <ClassTags />
                <TagGroups />
              </Stack>
            </ScrollArea.Autosize>
          </Grid.Col>
          <Grid.Col visibleFrom="md" pos="relative" span={{ base: 12, md: 3 }}>
            <TableOfContents
              variant="none"
              size="md"
              styles={{
                root: {
                  position: "sticky",
                  top: 75,
                },
              }}
              radius="md"
              scrollSpyOptions={{
                selector: "#help-modal-body :is(h1, h2, h3)",
                scrollHost,
              }}
              getControlProps={({ active, data }) => ({
                onClick: () =>
                  data.getNode().scrollIntoView({ behavior: "smooth" }),
                children: data.value,
                style: {
                  color: active
                    ? "var(--mantine-primary-color-light-color)"
                    : undefined,
                  background: active
                    ? "var(--mantine-primary-color-light)"
                    : undefined,
                },
              })}
            />
          </Grid.Col>
        </Grid>
      </Modal>

      <ActionIcon size="md" onClick={() => setOpened(true)}>
        <IconHelp size={48} />
      </ActionIcon>
    </>
  );
};

const Section = ({ title, children, path = "/" }) => {
  const [match] = useRoute(path);
  const ref = useRef();

  useEffect(() => {
    if (match) {
      ref.current.scrollIntoView();
    }
  }, [match]);

  return (
    <Stack component="section" gap="md" ref={ref}>
      <Title order={2} size="h3" c="var(--mantine-color-primary-text)">
        {title}
      </Title>
      <Divider />
      <Stack>{children}</Stack>
    </Stack>
  );
};

const Subtitle = ({ children }) => (
  <Title order={4} c="var(--mantine-color-primary-heading-text)">
    {children}
  </Title>
);

const PartyFinder = () => (
  <Section title={tls.PARTY_FINDER_TITLE} path="/party-generator">
    <Subtitle>What is this?</Subtitle>
    <Text>
      The party generator is the central utility of the site and the reason it
      was originally created.
    </Text>
    <Text>
      The idea is to make it as simple as possible to hit instance difficulty
      might score requirements as closely as possible, while respecting rules
      defining how parties must be organized.
    </Text>
    <Text>In a nutshell:</Text>
    <List type="ordered">
      <List.Item>Enter the target might score you want to hit.</List.Item>
      <List.Item>
        Optionally enter an acceptable score tolerance{" "}
        <Text span fs="italic">
          under
        </Text>{" "}
        the target.
      </List.Item>
      <List.Item>
        Enter the min/max group sizes and character levels you'd like to
        consider.
      </List.Item>
      <List.Item>
        Choose a tag group for grouping/classifying results by unique tags. (See
        tag groups section).
      </List.Item>
      <List.Item>
        Choose one or more rulesets which define how your group should be
        composed. (See rulesets section).
      </List.Item>
    </List>
    <Subtitle>Understanding results</Subtitle>
    <Text>
      Results are always sorted by descending score first if tolerance is
      applied, with the idea that ideally you're hitting your target. If you
      want to see lower score results, lower the target score.
    </Text>
    <Text>
      Results can be further sorted by ascending or descending might variance,
      and might density.
    </Text>
    <Text>
      Might variance sorts by might range within the party and standard
      deviation from the average: basically low variance will return groups of
      more homogenous power level and high variance will give you weaker
      characters combined with higher might carries.
    </Text>
    <Text>
      Might density sorts by might average and might score relative to group
      size, so you're looking at lower score per character, larger parties, vs.
      higher score per character, smaller parties.
    </Text>
    <Subtitle>What to do with results</Subtitle>
    <Text>
      Results in addition to being viewed in the list can be saved as parties
      for reference and further tweaking and might calculation, or if a result
      has a composition you'd like to recreate for future searches, each result
      can be used to create new rulesets directly from the results page.
    </Text>
  </Section>
);

const Parties = () => (
  <Section title={tls.PARTIES_TITLE} path="/parties/*?">
    <Subtitle>What is this?</Subtitle>
    <Text>
      Once you've found parties with the generator, you can save them to recall
      and recreate them later.
    </Text>
    <Text>You can also manually create parties, bypassing the generator.</Text>
    <Text>
      Saved parties display total might score and how it's reached, as well as
      other information on their composition, so you can use this UI as a might
      calculator to adjust warden ranks and levels to hit specific might scores.
    </Text>
    <Subtitle>Party "diff" tracking</Subtitle>
    <Text>
      The distance/diff of your saved party from the current roster is tracked
      and displayed, informing you of which characters have changed level/warden
      since the party was formed.
    </Text>
    <Text>
      The party index can be sorted by "readiness", prioritizing parties which
      are closer to current roster levels, classified as being "ready" if the
      party can be recreated by swapping warden rings alone with no
      leveling/deleveling.
    </Text>
    <Subtitle>Parties as the baseline for rulesets</Subtitle>
    <Text>
      By clicking the "Make Ruleset" button on the party details or index pages,
      you can initiate a UI to create a ruleset using the current party as a
      baseline.
    </Text>
    <Text>
      You can choose to include party slots in that ruleset by "slot" or
      warden+level score unit alone, by specific character name, or by held
      tags. See the section on rulesets for a bit more information.
    </Text>
  </Section>
);

const Roster = () => (
  <Section title={tls.ROSTER_TITLE} path="/roster/characters">
    <Subtitle>What is this?</Subtitle>
    <Text>
      The roster is your full roster of characters, their names, classes,
      levels, personal tags, and{" "}
      <Text span fs="italic">
        maximum
      </Text>{" "}
      warden ranks acquired.
    </Text>
    <Text>
      The intention is for the roster to represent the current state of your
      characters in game, for means of finding parties you can create, for
      calculating your current might scores, and for tracking changes you'd need
      to make to level/warden characters to re-form saved parties.
    </Text>
    <Text>
      The roster is the reference for all character data. While characters in
      parties can have their levels and warden ranks edited, their names, class,
      and tags are all defined by the roster. And at any time characters in
      parties can be synced back to their roster versions.
    </Text>
    <Alert title="Roster warden vs party warden">
      <Text mb="sm">
        Note that in the roster, a character's warden value is their maximum
        available warden rank, not the warden rank they're currently sitting at.
        This is important for party generation among other things, as warden
        levels are varied during the search to assemble your characters into
        different score configurations.
      </Text>
      <Text mb="sm">
        Parties are different. In parties, warden rank represents the exact rank
        that character needs to fit into the party. This is because first and
        foremost, parties are targeting a specific might score and the
        characters within them all have specific point values that add up to
        that score.
      </Text>
      <Text>
        In other words, the roster is tracking your characters potential to be
        slotted into a party at warden rk. 0 or warden rk. 3, while the
        character in the party is specifically warden rk. 2 because that's how
        the party hits the exact might score to target Spider Den on normal.
      </Text>
    </Alert>
    <Subtitle>Active status</Subtitle>
    <Text>
      Only characters who are active will be considered for party inclusion in
      the generator. So if the generator is returning errors complaining your
      roster is smaller than you think it is, make sure everyone is active.
    </Text>
    <Text>
      Additionally, inactive characters can be hidden by hitting the toggle at
      the top right of the roster screen. If you do so, their stats will also be
      removed from the pool giving you a more accurate readout of your potential
      might range and so on for your active roster.
    </Text>
    <Subtitle>Floating roster window</Subtitle>
    <Text>
      The roster along with the calculators can be opened in positionable
      floating windows which you can drag around the screen to position where
      they're convenient.
    </Text>
    <Text>
      For the roster, you may find this useful to have the roster open while
      using the party generator to quickly adjust character levels and warden
      ranks.
    </Text>
    <Text>
      The floating windows can be enabled via buttons on the bar at the bottom
      of the screen.
    </Text>
  </Section>
);

const RosterTags = () => (
  <Section title={tls.ROSTER_TAGS_EDITOR_TITLE} path="/roster/tags">
    <Subtitle>What is this?</Subtitle>
    <Text>
      The roster tags editor is just a collection of the tag inputs for all your
      characters in one place for convenience.
    </Text>
    <Text>
      You can also edit character tags in their individual modal edit forms, if
      you hate convenience.
    </Text>
  </Section>
);

const RosterIO = () => (
  <Section title={tls.ROSTER_IO_TITLE} path="/roster/io">
    <Subtitle>What is this?</Subtitle>
    <Text>
      The roster import/export tool is a simple means of importing or exporting
      and backing up your roster as CSV text.
    </Text>
    <Text>
      Just press the button to copy the field to export, or open the editor and
      paste in your serialized roster to import. The format is listed on the
      page and should be self-explanatory.
    </Text>
    <Text>
      While things are fairly stable, just note that this is a local app, all
      maintained in localstorage on your device. If you have even a semi-large
      roster you may want to back it up and keep it in excel/sheets/etc just in
      case your local data is cleared or somehow corrupted by an existing missed
      bug or future update.
    </Text>
  </Section>
);

const NpcSimulator = () => (
  <Section title={tls.NPC_SIMULATOR_TITLE} path="/npc-simulator">
    <Subtitle>What is this?</Subtitle>
    <Text>
      This calculator simulates (or at least resembles) the text spoken back
      when you{" "}
      <Text span ff="mono">
        /hail
      </Text>{" "}
      instance offering NPCs.
    </Text>
    <Text>
      It takes an instance tier and a might score and attempts to calculate what
      the instance NPCs will offer you at that score, without having to actualy
      delevel or reorganize your team in game to hit it.
    </Text>
    <Alert title="Note on floating tools">
      Note the "Floating Tools" bar at the bottom of the screen. The calculators
      and roster can be opened in floating windows to make them accessible
      globally. The NPC sim is a special case here as on the party page, it will
      return results for the might of the party you're viewing. This makes it
      convenient to edit a party, play around with the might score, and see
      immediate feedback as to how the new might score would affect your
      instance offerings.
    </Alert>
    <Text>
      Final note, as it says in the fine print on both calculators: the data is
      experimental and may or may not be 100% accurate or complete. Take the
      ranges given as a suggestion, but don't be too suprised if it's a point or
      two (or many) off.
    </Text>
  </Section>
);

const MightRangeFinder = () => (
  <Section title={tls.MIGHT_RANGE_FINDER_TITLE} path="/might-range-finder">
    <Subtitle>What is this?</Subtitle>
    <Text>
      The might range finder is a calculator which takes an instance tier and
      desired difficulty, and tries to calculate both all the might ranges the
      NPCs would offer you for that difficulty and the aura buff (Aura of Might)
      or debuff (Aura of Frailty) you'd receive at each.
    </Text>
    <Text>
      The results contain a set of links directly to the party generator to
      immediately try to find parties that have a might score at or near the top
      of each range provided by the calculator.
    </Text>
    <Alert title="Note on floating tools">
      Just like the NPC simulator and roster, the might range finder can be
      opened in a floating window. See the bar at the screen bottom.
    </Alert>
    <Text>
      Same as with the NPC sim: the data from the might range finder is
      experimental and may or may not be 100% accurate or complete. Take the
      ranges given as a suggestion, but don't be too suprised if it's a point or
      two (or many) off.
    </Text>
  </Section>
);

const TagRules = () => (
  <Section title={tls.TAG_RULES_TITLE} path="/rulesets/*?">
    <Subtitle>What is this?</Subtitle>
    <Text>
      Rulesets are combinable sets of rules which define how you'd like the
      party generator to aseemble your parties. A few examples:
    </Text>
    <List spacing="sm">
      <List.Item>
        <Text span fw="bold" c="primary">
          General Party Composition:
        </Text>{" "}
        Commonly, you'll define rules that specify the count of specific roles
        at different groups sizes. E.g. from size 2-6 you may want 1 character
        tagged "tank", while from 6-12 you'll want two.
      </List.Item>
      <List.Item>
        <Text span fw="bold" c="primary">
          "Core Team" Inclusion:
        </Text>{" "}
        You may want to ensure that your core group is always present, so you'd
        define a set of name-based rules that specifically require your main
        tank and cleric, then combine that ruleset with other sets which specify
        other needs.
      </List.Item>
      <List.Item>
        <Text span fw="bold" c="primary">
          Mutual Exclusion:
        </Text>{" "}
        Getting a bit more advanced, you may want to define rules that prohibit
        two characters from being grouped together because their skills overlap.
        You may define a rule that specifies one or the other must be included,
        then set the{" "}
        <Text span fs="itali">
          count
        </Text>{" "}
        of that rule to one, so both are never included at the same time.
      </List.Item>
    </List>
    <Subtitle>Composition of a rule</Subtitle>
    <Text>
      Rules come in two{" "}
      <Text span c="primary">
        "types:"
      </Text>
    </Text>
    <List spacing="md">
      <List.Item>
        <Text mb="sm">
          <Text span fw="bold" c="primary">
            All Type Rules:
          </Text>{" "}
          All type rules have no count and always operate on every character in
          the group, tracking max group size. They are intended for niche
          situations where every character in the group must pass the rule,
          regardless of whether that group is size 6, 9, or 20.
        </Text>
        <Text>
          It's extremely easy to brick searches with all type rules, so use with
          caution. This rule type was primarily intended for situations like
          flag/key tracking, where you want to be sure every character in the
          party has access to an instance.
        </Text>
      </List.Item>
      <List.Item>
        <Text mb="sm">
          <Text span fw="bold" c="primary">
            Range Type Rules:
          </Text>{" "}
          This will be by far the most common rule type. Range type rules have a{" "}
          <Text span c="primary">
            count
          </Text>
          , which defines how many characters they require. This count can be an
          exact number, a minimum, a maximum, or a min to max range.
        </Text>
        <Alert title="Note on max rules">
          It's quite easy to get yourself in trouble with max rules, especially
          if you have a small roster, as there needs to be room to bench
          characters that would put you over the limit. For example if you have
          a roster of 12 and 3 tanks, and you specify a rule requiring a max of
          2 tanks, then you will find zero 12 character parties because there's
          no way to bench that 3rd tank.
        </Alert>
      </List.Item>
    </List>
    <Text>
      All rules have a{" "}
      <Text span c="primary">
        "query".
      </Text>
    </Text>
    <Text>
      The query is one or more requirements that characters must fulfill to
      pass. Currently queries can target 5 attributes of a character:
    </Text>
    <List>
      <List.Item>
        <Text span fw="bold" c="primary">
          Level:
        </Text>{" "}
        The character's level. This can be specified exactly or with a range.
      </List.Item>
      <List.Item>
        <Text span fw="bold" c="primary">
          Class:
        </Text>{" "}
        The character's class.
      </List.Item>
      <List.Item>
        <Text span fw="bold" c="primary">
          Warden:
        </Text>{" "}
        The character's warden rank 0-3. Like level this can be a range.
      </List.Item>
      <List.Item>
        <Text span fw="bold" c="primary">
          Name:
        </Text>{" "}
        The character's specific name (or specifically NOT a character's name,
        for niche cases).
      </List.Item>
      <List.Item>
        <Text span fw="bold" c="primary">
          Tags:
        </Text>{" "}
        Specific tags the character has, or does not have.
      </List.Item>
    </List>
    <Text>
      Query requirements can be combined with OR and AND to arbitrary depth,
      i.e. you could use the editor to create a rule like:
    </Text>
    <Text ff="mono">
      (level &gt;= 67 AND warden &gt;= 2 AND (class = SHD OR class = WAR)) OR
      (level &gt;= 68 AND class = PAL)
    </Text>
    <Text>
      (You probably don't want to get too crazy like this, but you could).
    </Text>
    <Text>
      Finally, all rules have a{" "}
      <Text span c="primary">
        "size".
      </Text>
    </Text>
    <Text>
      The size of a rule is a range of group sizes to which it applies. This
      lets you change the rules as the group grows or shrinks, which is useful
      in defining party composition. E.g. 1 tank for groups &lt;= 6, 2 tanks
      exactly for 6-12, 3 or more tanks for 12+.
    </Text>
    <Subtitle>One big rulesets, or compositions of several</Subtitle>
    <Text>
      In the party generator you can activate as many rulesets as you want. You
      could have one large ruleset that encompasses everything, or you could
      have multiple smaller rulesets that handle different requirements.
    </Text>
    <Text>
      For example, you may define one rule that always requires your core tank &
      healer, but then have different rules that define different group types,
      e.g. caster vs. melee heavy.
    </Text>
    <Text>
      You may also have simpler utility type rulesets that define needs outside
      of role-based group composition, like key ownership, ports availability,
      evil vs good races, and so on. Rules like this are where the "All" type
      rules come in handy.
    </Text>
    <Subtitle>
      Creating rulesets from saved parties or generator results
    </Subtitle>
    <Text>
      The easiest way to create rulesets is to start with a party as a baseline.
    </Text>
    <Text>
      You can create rulesets from parties by pressing the "Make Ruleset" button
      on the generator results screen, or the parties index or details pages.
      When you press the button you'll be asked to name the ruleset, and
      presented with a table of all the party members.
    </Text>
    <Text>
      This table will contain all the characters in your party with checkboxes
      for all their attributes which can be the basis of rules. Click the
      headers to select or deselect each character.
    </Text>
    <Text>
      If tag groups can be applied to the characters they'll be presented in a
      dropdown and you can choose which tag group you'd like to use. The tags in
      the group which each character holds will be applicable as rules, which
      mirrors how the tag groups do their job grouping search results.
    </Text>
    <Text>
      Avoid being over-specific unless you're very sure of what you're doing, a
      few pointers:
    </Text>
    <List spacing="sm">
      <List.Item>
        Name rules should typically be used sparingly unless you're defining a
        core team as they're very specific and will greatly limit results. If
        you do use them, you should only pair them with warden. As level isn't
        varied during party generation, and tags are static, selecting
        name+level will or name+tags will fail 100% if you later level/delevel
        or change tags. Name+class is just redundant.
      </List.Item>
      <List.Item>
        Rules created by this generator will always define a minium size and no
        max. This can be changed after in the rules UI if you want, but
        generally, this leads to more stable rules that will return better
        results.
      </List.Item>
      <List.Item>
        These rules are also applied to all party sizes. Realistically, what
        you'll probably want to do is create your ruleset and then adjust it to
        sizes which make sense for your needs. An advanced move would be to make
        multiple rulesets for different party sizes, then select them both at
        the same time in the party finder to cover any group size.
      </List.Item>
      <List.Item>
        Like rules will be merged, so for example if you select the whole
        "level" column and you have 3 level 66s and 3 level 67s, you'll end up
        with 2 rules: at least 3 characters level 66, and at least 3 characters
        67. (Again, these rules are always min, no max).
      </List.Item>
      <List.Item>
        Remember this generator is just intended for a quick baseline to find
        new parties with similar compositions to existing ones. The rules UI is
        unfortunately a bit clunky but it will let you write nested logic rules
        and give you full control over min/max counts and group sizes where the
        rules apply.
      </List.Item>
    </List>
  </Section>
);

const ClassTags = () => (
  <Section title={tls.CLASS_TAGS_TITLE} path="/class-tags">
    <Subtitle>What is this?</Subtitle>
    <Text>
      Class tags are a convenient way to manage tags common to all characters of
      the same class. E.g. in most cases every warrior is a "tank" and every
      cleric is a "healer".
    </Text>
    <Text>
      Characters of the respective classes are always assigned these tags during
      party generation. If you{" "}
      <Text span fs="italic" fw="bold">
        don't
      </Text>{" "}
      want a character to have certain tags, you will need to delete the tags
      you don't want assigned here.
    </Text>
    <Subtitle>Primary Rules Driver</Subtitle>
    <Text>
      Tags are not just cosmetic, rather they form the basis for any party
      generation rules not based on name, level, class, or warden status. The
      most obvious use cases here are for combat roles (tank, healer, dps,
      support), but you could also use tags to mark characters who've acquired
      specific raid keys, or those who have non-combat roles like "porter" or
      "coth", to make sure your party has specific utility.
    </Text>
  </Section>
);

const TagGroups = () => (
  <Section title={tls.TAG_GROUPS_TITLE} path="/tag-groups">
    <Subtitle>What is this?</Subtitle>
    <Text>
      Tag groups are arbitrary tag sets used to group and classify characters in
      party generator search results.
    </Text>
    <Text>
      They can be any tags you like, with the only rule being that everyone in
      active the roster has to have at least one of them so they have a group to
      fall into when results are found.
    </Text>
    <Text>
      It's important to make the distinction that while{" "}
      <Text span fs="italic">
        tag groups
      </Text>{" "}
      use the same tags as{" "}
      <Text span fs="italic">
        tag-based rules
      </Text>
      , the two features serve different purposes. Tag groups are used to group
      results for the purposes of classifying slots in party compositions, while
      tag-based rules use those same tags to decide on who gets put in the
      parties to begin with.
    </Text>
    <Text>
      For convenience two "roles" tag groups come predefined, which you can use
      or edit to your preferences. You'll probably find that role-like tags are
      the most obvious use-case here, as filling party roles is arguably the
      most important criteria for the party generator.
    </Text>
    <Alert title="Note on multiple tag holders">
      Note that if characters are tagged with{" "}
      <Text span fs="italic" size="sm">
        more than one
      </Text>{" "}
      of the tags in a group, they won't be grouped by each tag individually,
      but rather they'll be put into a merged group that requires all the group
      tags they're assigned. For example if you have a mage who you've tagged as
      a "tank" and as "dps", their group tag using the default roles tag group
      would be "dps+tank".
    </Alert>
    <Subtitle>Usage with Rulesets</Subtitle>
    <Text>
      Tag Groups are used to group characters in your party generator results,
      but on the other side, they're also used when turning around and creating
      rulesets from part generator results and existing parties.
    </Text>
    <Text>
      When you open the form to create a ruleset from a party, there will be a
      dropdown there for tag groups. A few key things to note:
    </Text>
    <List spacing="sm">
      <List.Item>
        The tag group selected by default is the one that's currently active in
        the group finder.
      </List.Item>
      <List.Item>
        Only tag groups which are applicable to the current party will appear in
        the list. This means they must follow the rule that every character must
        have one of the tags. If a tag group isn't showing up in the dropdown
        when creating a ruleset, this is why.
      </List.Item>
    </List>
    <Text>
      YMMV, but in practice tag based rulesets are likely going to be the most
      useful, as they allow flexibly specifying party slots by role/function,
      whereas name/character based rules are inherently extremely rigid, and
      rules based on level+warden alone don't have any opinion on party
      composition besides score.
    </Text>
  </Section>
);
