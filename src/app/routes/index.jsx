import { Route } from "wouter";
import { Home } from "./home";
import { ClassTags } from "./class-tags";
import { NpcSimulator, MightRangeFinder } from "./calculators";
import { PartyFinder } from "./party-finder";
import { Roster, Parties } from "./chars";
import { TagGroups } from "./tag-groups";
import { Rules } from "./rules";

export const Routes = () => {
  return (
    <>
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
    </>
  );
};
