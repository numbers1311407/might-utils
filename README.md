## Might Utils

The main feature here is a tagging system for your roster & combinations generator to return all
possible group compositions for a given might score.

Basically add your characters to the roster, optionally configure their personal tags or class
specific tags, define tag based rules to specify requirements by group size (i.e. a 6-man group
may require 1 tank and 3 dps, while a 12-man group may require 2 tanks and >=5 dps, and so on),
then input your target might score & options into the calculator to see how you can assemble
your current team & warden ranks.

### Potential Feature Roadmap

- Count-like range expression for level rules, e.g. 68+, 65-66.

- Easy selection of might difficulty thresholds by instance name or tier (in a dropdown or similar).

  This feels like it'd be a big QoL improvement. I.e. you select "Timeless Guk (Normal)" and your
  score req is set to 400 and team size set to max 3. It'd require a full list of instances of
  course as well as full confirmation of the scores and difficulty requirement calculation.

- Saved "pools" in roster management.

  Likely not worth the effort since the roster already has a quick means of toggling characters'
  active status. This would primarily be useful for people with large rosters and specifically,
  those that keep more than 1 character per account, meaning there'd be different sets of possible
  characters logged in at once.

- react-query for a caching layer for results

  May or may not be worthwhile as the queries are so configuration heavy, but at a minimum it
  would debounce rapid finds triggered by extra renders for free
