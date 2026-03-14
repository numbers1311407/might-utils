## Might Utils

The main feature here is a tagging system for your roster & combinations generator to return all
possible group compositions for a given might score.

Basically add your characters to the roster, optionally configure their personal tags or class
specific tags, define tag based rules to specify requirements by group size (i.e. a 6-man group
may require 1 tank and 3 dps, while a 12-man group may require 2 tanks and >=5 dps, and so on),
then input your target might score & options into the calculator to see how you can assemble
your current team & warden ranks.

More features may follow.

### Current Todos

- completing rules editing and cleanup
  - simplfiy the schemas where possible to avoid multi-type fields, namely rules' warden and range
  - this will mean we only need to humanize values on the way to UI and then parse them in the finder
    in the prepare phase. find a place for these transforms, thinking likely helpers in schema.
    likewise this will simplify the form extension clusterfuck trying to get useForm to play nice with
    the schemas. that should be simpler and we can just put string validation on the base schemas
    (these validation functions/regexes also live in helpers as they're part of the transforms)
  - add IDs to the rule schemas to fix a few issues, namely making it simpler to move rules around
    and validate unique value/type pairs in size arrays. basically the presence of an ID will make
    it possible to identify if that value/type pair in your parent is a new rule, or the rule being
    edited, and it will mean adding and updating rules in the store can use the same function as the
    presence of an id serves for lookup and to identify new records.
  - fix the rules forms now that we have ID and cleaner schemas
    - submitting a rule should validate that it's unique in the size group
    - submitting a rule should validate that no numbers in the range or value are greater than the group size
    - moving a rule should work
    - clean up on all the junk in the rules forms
  - fix the logic in the finder to accommodate the simplified string values for warden, range, etc.
  
- rename ruleSet to ruleset everywhere, it's killing me.

- ui for grouping and improved grouping
  - solidify concept that it's ok to have both multi-tag and unique-tag grouping
    - basically for multi, the idea would be just adding multi chars as unique group tags, essentially
      instead of tag:level+warden:count it'll be tag/tag/tag:level+warden:count, sorted. i don't expect
      this will cause any issues but it might result in some strange groups.
    - then for unique it's actually a bit more complicated, but the idea would be to add 1 roster slot
      for each unique tag, i.e. difa (dps) and difa (tank). We'd then have to *remove* the other tags
      for those character, so difa as a tank would be stripped of the dps tag and vice versa.
    - the simplest UI is probably to make a simple "group tag sets" data type which is solely a name,
      id, and tags field, maybe a checkbox for inclusion on the main form. There'll be a default "roles"
      one with the usual editable but not renameable/deletable pattern. We'd validate that the field
      has 2 tags min, and maybe a max if it proves that we hit millions of recursions quickly on tag
      expansion.
    - then finally a slightly advanced dropdown with 2 sections where you can choose flat results, one
      of the default tag groups, or the list of created group tag sets.
    - there'll be a checkbox that hides or disables when grouping by tag is not selected to toggle
      unique per char group tags (what to call this wil be a pain).
      
- final pass at UI and style refinement
  - roster view needs completion and styling
  - lineups results view needs completion and styling
  - figure out a real solution for routing where the suspense actually works and lineups requests aren't
    made if the results page isn't up.
  - history updates on the edit pages would be nice for persisting active edited objects on refresh,
    but otherwise probably not very useful
  - as part of that re-routing move the tabs up to the header, copying the mantine site.
  - copy other good parts of the mantine site. the title looks nice too.
  
  - final code cleanup before release
    - i don't know how much to do here but at the very least we probably change the layout to "pages" versus
      features and just shrink the number of folders if possible
      
  - done?
      

### Potential Feature Roadmap

- Easy selection of might difficulty thresholds by instance name or tier (in a dropdown or similar).

  This feels like it'd be a big QoL improvement. I.e. you select "Timeless Guk (Normal)" and your
  score req is set to 400 and team size set to max 3. It'd require a full list of instances of
  course as well as full confirmation of the scores and difficulty requirement calculation.
      
- Saved tag rule configuration sets.

  Could be useful especially if one is using niche teams that don't fit typical comps.
      
- Saved lineup results.

  Could be useful to keep track of go to team comps for different score reqs.
  
- Manual lineup editing/creation.

  Goes along with saved lineup results. If you can save a lineup it's likely you'd also want
  to be able to adjust it. Or perhaps you just want to manually assemble your group and don't
  need the lineup generator. 
      
- Saved teams/pools in roster management.

  Note the difference between what the code refers to as "lineups" and "pools" ("team" may be
  a better word than "pool", tbd). The lineup is the team you're taking into an instance, while
  the team/pool is all the characters available for the calculator to draw from.

  This may or may not be worthwhile as by design, the calculator is pulling from all available
  characters to try to achieve the might score, and it should already be easy to filter lineup
  output by using tags. The initial concept was just toggling on/off of active status to reduce
  the pool size up front, but saved pools may be useful for people with lage character counts,
  and particularly useful for people who keep multiple characters on the same accounts, meaning
  only subsets of characters can be active at once.
  
- react-query for a caching layer for results

  may or may not be worthwhile as the queries are so configuration heavy, but at a minimum it
  would debounce rapid finds triggered by extra renders for free
