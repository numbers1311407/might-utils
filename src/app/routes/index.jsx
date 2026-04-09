import { Route, Link } from "wouter";
import { PartyFinder } from "@/features/party-finder";
import { ClassTags } from "@/features/class-tags";
import { TagGroups } from "@/features/tag-groups";
import { NpcSimulator, MightRangeFinder } from "@/features/calculators";
import { TagRules } from "@/features/tag-rules";
import { Roster, Parties } from "@/features/chars";

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
