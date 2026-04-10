## Might Utils

Going through a bit of a pivot, updating soon.

### Todos

- Features
  - Finder
    - I think it's going to be critical to test rules and other common sense failure
      points to error early in search. it's too easy to accidentally set your level 1-off,
      etc, and end up scratching your head for a minute trying to figure out why you got no results
        - if min/max options mean you don't have enough to meet min group size
        - if roster score doesn't add up to target score
        - if rules at all ranges exclude everyone
        - others?
      If results are low, we could also warn on the above if they're ALMOST true, like if your
      party only just meets the score, or if there's only a brief window where enough chars
      pass.
    - UI for results and other UI cleanup.
        - two key new features:
          - grouped results should clearly show who fulfills each of the grouped properties.
          - rules should clearly show who matched them
    - We shouldn't return all results. It should:
      - stop after finding a flat count of results.
      - return what it's found if instances do go over
      - if there are many results it should advise to add filters or reduce options
    - Needs to accept search params, and consider how that will affect saved
      finder options. Thinking it will consume them immediately on load and then there
      can be a "share" button to copy the link. 
    - Roster Variations select when that's ready
    - Potentially roster quick edit
    - Multiselect for rulesets
    - Toggle for distinct vs merged group tags mode
    - Helper link on the right to tag rules, just for clarity and since they can't
      be edited inline
    - Tracking when rules *cannot* be passed or can only be passed by a few chars,
      to warn players of rules that may be problematic.
  - Might Range Finder
    - complete UI
    - include links from the might ranges to the finder, and possibly listings
      of "saved parties" that match the might level or are close?
  - NPC Sim
    - Should add a 2nd window with metadata, namely links to the finder for the
      actual numeric ranges in the NPC response that you don't see in game.
  - Misc
    - Put together a character roster that isn't my team
  - Saved parties
    - The might score calculator should track min/max and current might, which
      is a little tricky with static warden. Depending on the solution this may
      be post MVP. The whole idea for parties is that they have a static might
      level not a range.
    - I think being able to save a snapshot to revert to might be another path
      here. The thing is that playing around with might comes with the req. to
      put it all back when you're done, so you hesitate to mess with it. THe
      counterpoint is that you can always very rapidly copy a group and have
      multiple versions of it, so perhaps the plan should be to encourage that.
  - Tag rules
    - Name rule should probably be back on the menu. It made less sense when one ruleset was the
      tech but if you have multiple rulesets I could see having "core team" or "tank 1" "tank 2"
      rulesets which you could mix into other sets. Does this remove the need for toggleable
      warden ranks? probably not... since it's still clunky and the rule would require the char,
      vs jsut restricting hte rank.
    Global: 404 page
    - an actual in app 404 page for bad paths
- Known Bugs
  - Clear for now
 
### Nice to haves
  **More calculator data**
    - This is critical but I'm also waiting to see if post release either 1. we're asked not to
      do this or 2. a dev might offer us real data.
  **Roster Variations**:
    - This is a key feature but it could technically be cut from mvp
    - Refactor current "saved parties" into roster variations
    - Allow choosing roster in generator
    - Bulk tag editing with the same exacty UI as class tags
  **Global**: Help modals and/or guided tours
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
- Multiple: Tags
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
