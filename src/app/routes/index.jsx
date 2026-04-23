import { Route, Link } from "wouter";
import { ClassTags } from "./class-tags";
import { NpcSimulator, MightRangeFinder } from "./calculators";
import { PartyFinder } from "./party-finder";
import { Roster, Parties } from "./chars";
import { TagGroups } from "./tag-groups";
import { TagRules } from "./tag-rules";

const HomePage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <div>
        <Link href="/party-generator?targetScore=1250">1250</Link>
      </div>
      <div>
        <Link href="/party-generator?targetScore=1010&margin=10">
          1010 and 10 margin
        </Link>
      </div>
    </div>
  );
};

export const Routes = () => {
  return (
    <>
      <Route path="/">
        <HomePage />
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
        <TagRules />
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
