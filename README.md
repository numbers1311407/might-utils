## Might Utils

Work in progress companion app for EQ Might, providing a set of tools to make your might experience
more convenient:

1. A party generator which uses a tag based rule system and a recursive might score solver to
   generate parties targeting specific might scores.
2. The ability to save party templates based on might scores, levels, and tags and to generate
   parties directly from those templates using rules defining your personal preferences.
3. The ability to save parties of your roster characters at specific character and warden levels,
   and to track how close your current roster is to being able to reassemble those parties.
4. Calculators to determine might ranges required for specific instance tiers and targeted
   difficulties, and to preview what instance offerings you'll be given for parties at different
   might levels.

### Release checklist

- **Party Generator: MVP**
  - Throw better errors from the party finder to give players hints on why results are missing
    - warn if the roster isn't big enough to fill the party size
    - warn if characters pass no rules or few rules
  - UI for results and other UI cleanup.
      - two key features:
        - grouped results should clearly show who fulfills each of the grouped properties.
        - rules should clearly show who matched them
  - Multiselect for rulesets
- **Might Range Finder: MVP**
  - complete UI
  - include links from the might ranges to the finder, and possibly listings
    of "saved parties" that match the might level or are close?
- **Parties: MVP**
  - Parties needs an index page with filtering & sorting
  - Sort by name, might score, diff
  - The show page probably doesn't need the shared header, it's kind of fighting for space
  - Comp breakdown view (eventually this will link to the comp)
  - Embrace the range. Show might, min and max prominently.
  - Instead of an edit mode, consider a big old "save changes" button and perhaps confirmation
    on routing away. The thing is I think we need some way for users to roll back changes,
    be that an "edit mode" where users enter manually and have to commit to save, a
    save button and a confirmation on leaving, an "undo" functionality (question would
    be when the quicksave happens), or even a manual snapshot like we had previously.
    Manual snapshot could be interesting but it clutters the UI further, though there's
    plenty of room in the diff table for a 3rd column: snapshot compare.
  - The point is: users need to be able to mess with the form and know they can revert what
    they did. No one wants to try to remember the level and warden settings for 12 chars.
    
- **NPC Sim: MVP**
  - Should add a 2nd window with metadata, namely links to the finder for the
    actual numeric ranges in the NPC response that you don't see in game.
  **Global: 404 page**
  - an actual in app 404 page for bad paths
- **Tag rules: Name rules in the builder**
  - This doesn't solve warden toggling but it's a start. Having "name" type rules in the builder would
    allow for rules like "name is tank1 and level > x or name is tank2 and level > y".
  **Issues**
  - For parties and other records with duplicate name generation, if the name is near max it
    will fail validation silently. The answer is probably to not do that, we have the create
    form right there and can just ask for the name.
  
### Post MVP Roadmap

- **Calculators: Compelte calculator data**
  - This is critical but I'm also waiting to see if post release either 1. we're asked not to
    expose the calculators and need to remove them or 2. a dev might offer us real data, or
    3. we could crowdsource some more data from others with access to different tiers.
- **Multiple: Warden shouldn't toggle**
  - Character warden options shouldn't be a toggle, it should be possible to toggle specific
    warden levels on or off. This would be possible with the reintroduction of name rules but
    it would be a very clunky and expensive approach for what should be a reduction in complexity
    via voluntary pool shrinking.
- **Roster: Alt tags**
  - The tags ui should be removed from the modal and replaced witha link to the roster tags editor,
    making that the only place to edit character tags.
  - In that editor the characters have a toggle to turn on their "alt" tags, allowing for two tag
    sets. This is the replacement for lost functionality from the removal of
    "distinct grouping tags", but better as it's more controlled.  Implementation would probably
    be a 2nd tags array. For UI purposes the char would just be considered to have all the tags,
    but in the party finder they'd be split.
  - Potentially we could even have a separate toggle for the alt tag version, letting the active
    roster include either or both.
- **Calculators: Might Range Finder**
  - A toggle to show "and up" from the dificulty to show the full range.
  - This calculator is currently confusing because as it only shows you one difficulty, it
    also presents gaps where the difficulty has shifted. There's probably a better UX here.
 
### Nice to haves (future work)

- **Tag Rules: Prettify**
  - decorate the rules human output with JSX to colorize keywords and so on.
  - RQB has NO validation. it should at least test for blank fields and no rules.
- **Tags: Negative tags**
  - Introduce the concept of "negative tags" which could be used to couner class tags.
  - The main case is there may be times where a character doesn't want class tags,
    and it feels like overkill to create some kind of clone situation or other complicated
    change to fix that. Negative tags are never seen in the UI, they're processed out
    to "remove" class tags from arrays before being rendered or sent to the finder.
    In tag input, they're consumed and rendered as toggleable class tag pills.
    One consideration here is that if someone deletes a class tag the -tag may live
    on in tags forever, but that's probably not a real issue. If concerned we could
    scrub tags for orphaned negative tags via schema transform.
- **Global: Help/guidance**
  - Help modals and/or guided tours
- **Roster: Character portraits**
  - baldur's gate style 2 portrait options to use in small UI besides the class icons to
    distinguish between members of the same class. There are plenty of places where you want
    to show a list of party characters which would love a more concise way to display them
    not reliant on hover behavior. Having a library of various D&D class looking icons to
    select from (or even to "upload" your own) would be very cool for this.
- **Multiple: Might Button QoL**
  - bigger increment buttons for the might inputs +100/-100, etc, this will be
    particularly useful on the calculator pages where people are fishing and wanting
    to just click buttons.
  
### Ruled out or questionable ideas

- **Roster Variations**
  - Early on there was a concept of adding multiple rosters to choose from where you could
    extend/modify the base roster. I think in reality this is an overkill concept that would
    be better solved with "alt" (child) roster characters or just alt tag sets.

### Potential optimizations

- react-query for a caching layer for finder results and a more promise based approach
