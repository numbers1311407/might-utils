## Might Utils

Going through a bit of a pivot, updating soon.

### Todos

- Features
  - Finder
    - UI for results and other UI cleanup.
        - two key new features:
          - grouped results should clearly show who fulfills each of the grouped properties.
          - rules should clearly show who matched them
    - Needs to accept search params, and consider how that will affect saved
      finder options. 
    - Roster Variations select when that's ready
    - Potentially roster quick edit
    - Multiselect for rulesets
    - Toggle for distinct vs merged group tags mode
    - Helper link on the right to tag rules, just for clarity and since they can't
      be edited inline
    - Tracking when rules *cannot* be passed or can only be passed by a few chars,
      to warn players of rules that may be problematic.
  - Group Tags
    - Needs UI
  - Saved parties
    - Replace the current "saved parties" with a simpler UI that's more Read
      than Update, with a smaller roster editor, no tags editing (but a tag
      cloud probably), and baked in might calculator tied to might score
  - Might Range Finder
    - complete UI
    - include links from the might ranges to the finder, and possibly listings
      of "saved parties" that match the might level or are close?
  - NPC Sim
    - Should add a 2nd window with metadata, namely links to the finder for the
      actual numeric ranges in the NPC response that you don't see in game.
  - Misc
    - Put together a character roster that isn't my team
    - Create a default tag rule set for plane of time key as an example of an all
    - A global help modal store in the vein of the confirmations store where pages
      can jam some stuff into a help modal that will disappear on close until the
      (TBD) help button in the top right is clicked.
    
- Bug fixes
  - Errors in the finder crash the page and can't be navigated away from without
    a reload. The finder app at least needs to catch errors and show beter error UI,
 
### Nice to haves
  **Roster Variations*
    - This is a key feature but it could technically be cut from mvp
    - Refactor current "saved parties" into roster variations
    - Allow choosing roster in generator
    - Bulk tag editing with the same exacty UI as class tags
- Roster import
  - A csv roster import would be very easy and probably a great help to people
    with large teams.
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
