import { Route, Switch } from "wouter";
import { Stack, Text } from "@mantine/core";
import { AppLink } from "@/core/components";
import { Home } from "./home";
import { ClassTags } from "./class-tags";
import { NpcSimulator, MightRangeFinder } from "./calculators";
import { PartyFinder } from "./party-finder";
import { Roster, Parties } from "./chars";
import { TagGroups } from "./tag-groups";
import { Rules } from "./rules";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/party-generator">
        <PartyFinder />
      </Route>
      <Route path="/roster">
        <Roster />
      </Route>
      <Route path="/roster/characters">
        <Roster />
      </Route>
      <Route path="/roster/tags">
        <Roster />
      </Route>
      <Route path="/roster/io">
        <Roster />
      </Route>
      <Route path="/might-range-finder">
        <MightRangeFinder />
      </Route>
      <Route path="/npc-simulator">
        <NpcSimulator />
      </Route>
      <Route path="/rulesets/:id?">
        <Rules />
      </Route>
      <Route path="/class-tags">
        <ClassTags />
      </Route>
      <Route path="/tag-groups">
        <TagGroups />
      </Route>
      <Route path="/parties/:id?">
        <Parties />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

const NotFound = () => (
  <Stack p="lg" ta="center" pt={80}>
    <Text size="3xl" fw="bold">
      Whoops, how'd you get here?
    </Text>
    <Text size="xl">There's no page at this path.</Text>
    <AppLink size="xl" href="/">
      Return Home
    </AppLink>
  </Stack>
);
