## Might Utils

Work in progress companion app for EQ Might, providing a set of tools to make your might experience more convenient, helping to figure out the might score you need and then helping to
manage parties that satisfy that score.

### Release checklist

- **Party Generator: MVP**
  - Error messaging - if there are zero (or potentially low) results, show human errors as to why that is. This will be critical for comp searches.
  - Complete the search results with links to save party, comp
  - Save party and comp should be modal based and on success, show a green check + message and present a link to go there now or close. This should all be doable with the modal
- **Parties: MVP**
  - Parties needs an index page with filtering & sorting
  - Sort by name, might score, diff
  - The show page probably doesn't need the shared header, it's kind of fighting for space
  - Comp breakdown view - Named/linked if saved, modal to save if not saved.
  - Edit mode - one way or another users need to be able to mess with parties without committing changes. Edit mode solves this, while also making changes more intentional.  Roster doesn't feel like it needs this because by its nature it's constantly changing. Editing a saved party should be more intentional, while the ability to edit without committing also makes it possible to play around with the scores.
- **Saved Comps**
  - Saved comp store
    - name
    - value/comp (primary key)
    - tag group - questionable but making this link to tag group by ID mean we don't have to hardcode the tags into the comp string (it would use the no-terms option) and instead it'd just be a default query param. We can make it so if the tags group is changed on the comp search a button becomes active to save the change. But all this is is a default tag group which gets incorporated into the rules. Note this means there's only one type of comp, which can optionally be further specced with tags.
- **Might Range Finder: MVP**
  - complete UI
  - include links from the might ranges to the finder, and possibly listings of "saved parties" that match the might level or are close?
- **NPC Sim: MVP**
  - Should add a 2nd window with metadata in the main calculator, namely links to the finder for the actual numeric ranges in the NPC response that you don't see in game.
  **Global: 404 page**
  - an actual in app 404 page for bad paths
  **Issues**
  - For parties and other records with duplicate name generation, if the name is near max it will fail validation silently. The answer is probably to not do that, we have the create form right there and can just ask for the name.
  
### Post MVP Roadmap

- **Saved Comps**
  - Saved comps "search" UI
  - There's consideration whether this is treated as a first class record with its own "search page", but I think it makes more sense as party finder "mode" largely because we'll be linking to comp-based searches from other results and parties, and the act of saving is essentially like a permalink to a page on the site that already exists.
- **Roster Changes**
  - Move the tag forms to the roster page and kill the tags editor
  - Let's do negative tags, it's almost there with the locked tag concept they just need to be toggleable instead of deletable. That toggle will be in the form of a 2nd tags array, antitags. And while we're at it, add might toggle buttons on the roster nav as well now that we're committing to opening that UI up a bit.
  - (probably actually just separate out the party list now since the two components are so different.
- **Calculators: Complete calculator data**
  - This is critical but I'm also waiting to see if post release either 1. we're asked not to expose the calculators and need to remove them or 2. a dev might offer us real data, or 3. we could crowdsource some more data from others with access to different tiers.
- **Multiple: for finder purposes each warden rank should be opt-in**
  - Character warden options shouldn't be a fixed range, it should be possible to toggle specific warden levels on or off. This would be possible with the reintroduction of name rules but it would be a very clunky and expensive approach for what should be a reduction in complexity via voluntary pool shrinking.
- **Roster: Alt tags**
  - The tags ui should be removed from the modal and replaced witha link to the roster tags editor, making that the only place to edit character tags. In that editor the characters have a toggle to turn on their "alt" tags, allowing for two tag sets. This is the replacement for lost functionality from the removal of "distinct grouping tags", but better as it's more controlled.  Implementation would probably be a 2nd tags array. For UI purposes the char would just be considered to have all the tags, but in the party finder they'd be split.
  - Potentially we could even have a separate toggle for the alt tag version, letting the active roster include either or both.
- **Calculators: Might Range Finder**
  - A toggle to show "and up" from the dificulty to show the full range.
  - This calculator is currently confusing because as it only shows you one difficulty, it also presents gaps where the difficulty has shifted. There's probably a better UX here.
- **Party Generator: Analytics**
  - Show analytic data about the search and potentially some analysis to go along.
 
### Nice to haves (future work)

- **Saved Comps: Party builder/Party Integration**
  - A few ideas:
    - Parties could have fixed comps which which would change the layout of their
      page to show the comp sections. We wouldn't restrict sections to be only
      eligible characters probably, just rather show how the character is invalid
      for the slot they're in.  In the char-select, you could add any character to
      a slot but it would prioritize that that belong there. Characters already
      slotted will show in the select where they're slotted, and require a quick
      in-place confirmation (custom option field, in place ok press).
    
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
