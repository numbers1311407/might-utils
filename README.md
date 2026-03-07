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

- [ ] UI based configuration of the group size based tag rules (currently static)
- [ ] UI based management of the main roster (currently static)
- [ ] Refinement of the results display and overall UI layout, including results format & grouping
- [ ] Addition of react-query to the data layer to provide caching

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
