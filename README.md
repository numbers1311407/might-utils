## Might Utils

Going through a bit of a pivot, updating soon.


### HOTLIST from Todos

- finder results page
- name rules?
- theme cleanup/testing & overall design consistency

### Todos

- Finder
  - Throw better errors from the party finder to give players hints on why results are missing
    - warn if the roster isn't big enough to fill the party size
    - warn if characters pass no rules or few rules
  - UI for results and other UI cleanup.
      - two key features:
        - grouped results should clearly show who fulfills each of the grouped properties.
        - rules should clearly show who matched them
  - Multiselect for rulesets
- Might Range Finder
  - complete UI
  - include links from the might ranges to the finder, and possibly listings
    of "saved parties" that match the might level or are close?
- Parties rewrite
  - Scrap and replace the party store with something more hook driven using lessons learned.
  - Parties needs an index page with filtering & sorting
  - Parties should track might score
  - Parties should have concept of "diff score" tracking how close the current roster can get to
    the party comp.
  - Sort by name, might score, diff
  - Parties needs a coloring/indicator scheme for identifying diff state, maybe con colors?
    - roster satisfies the comp - 0 diff
    - roster can satisfy the comp by shuffling warden - small diff
    - roster needs to change levels - large diff
- NPC Sim
  - Should add a 2nd window with metadata, namely links to the finder for the
    actual numeric ranges in the NPC response that you don't see in game.
- Alt tags
  - the tags ui should be removed from the modal and replaced witha link to the roster tags editor
    in that editor the characters have a toggle to turn on their "alt" tags, allowing for two tag
    sets. this is the replacement for distinct grouping tags, but better as it's more controlled.
    implementation would probably be a 2nd tags array. For UI purposes the char would just be
    considered to have all the tags, but in the party finder they'd be split.
- Tag rules
  - Name rule should probably be back on the menu. It made less sense when one ruleset was the
    tech but if you have multiple rulesets I could see having "core team" or "tank 1" "tank 2"
    rulesets which you could mix into other sets. Does this remove the need for toggleable
    warden ranks? probably not... since it's still clunky and the rule would require the char,
    vs jsut restricting hte rank.
  Global: 404 page
  - an actual in app 404 page for bad paths
 
### Nice to haves
  - **More calculator data**
    - This is critical but I'm also waiting to see if post release either 1. we're asked not to
      do this or 2. a dev might offer us real data.
  - **Roster Variations**
    - This is a key feature but it could technically be cut from mvp
    - Refactor current "saved parties" into roster variations
    - Allow choosing roster in generator
    - Bulk tag editing with the same exacty UI as class tags
  - **Global** Help modals and/or guided tours
  - Multiple: Warden shouldn't toggle
    - Character warden options shouldn't be a toggle, it should be possible to
      toggle any warden level.
    - This will require thinking about "max" level if that happens in regards to
      the idea of a "max level" reading for the calculator. This is already a problem
      for parties.
- Character portraits
  - baldur's gate style 2 portrait options to use in small UI besides the class icons and
    distinguish between members of the same class.
  
- Roster import
  - A csv-like roster import would be very easy and probably a great help to people
    with even semi large teams. I think realistically this could be a textarea with a
    simple example backed by a schema for validation.
- Tag Rules
  - decorate the rules human output with JSX to colorize keywords and so on.
  - RQB has NO validation. it should at least test for blank fields and no rules.
- Quick roster editing
  - add a mantine "floating window" modal to the generator which contains a mini roster
    editor (as currently selected), likely similar to the saved partie pages.
- *Multiple: Tags*
  - Introduce the concept of "negative tags" which could be used to couner class tags.
    The problem is there may be edge cases where a character doesn't want class tags,
    and it feels like overkill to create some kind of clone situation or other complicated
    change to fix that. Negative tags are never seen in the UI, they're processed out
    to "remove" class tags from arrays before being rendered or sent to the finder.
    In tag input, they're consumed and rendered as toggleable class tag pills.
    One consideration here is that if someone deletes a class tag the -tag may live
    on in tags forever, but that's probably not a real issue. If concerned we could
    scrub tags for the class tag on deletion.
  
- Multiple: Might Button QoL
  - bigger increment buttons for the might inputs +100/-100, etc, this will be
    particularly useful on the calculator pages where people are fishing and wanting
    to just click buttons.
- Range Finder
  - A toggle to show "and up" from the dificulty to show the full range.

### Potential Feature Roadmap

- react-query for a caching layer for results
